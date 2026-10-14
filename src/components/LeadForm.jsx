import { useState } from "react";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  jobTitle: "",
  source: "Website",
  status: "New",
};

const SOURCES = ["Website", "LinkedIn", "Referral", "Event", "Outbound"];

const STATUSES = ["New", "Contacted", "Qualified", "Converted", "Disqualified"];

function LeadForm({
  existingLeads = [],
  initialData = null,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM,
    ...(initialData || {}),
  }));

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const isEditing = Boolean(initialData);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      email: name === "email" ? "" : previous.email,
      form: "",
    }));

    setSuccessMessage("");
  }

  function validateForm() {
    const nextErrors = {};

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();
    const company = formData.company.trim();

    if (!firstName) {
      nextErrors.firstName = "First name is required.";
    }

    if (!lastName) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!company) {
      nextErrors.company = "Company name is required.";
    }

    const duplicateEmail = existingLeads.some((lead) => {
      const existingEmail = String(lead.email || "")
        .trim()
        .toLowerCase();

      return existingEmail === email && lead.id !== initialData?.id;
    });

    if (email && duplicateEmail) {
      nextErrors.email = "This email already exists. Please use another email.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    const leadData = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      company: formData.company.trim(),
      jobTitle: formData.jobTitle.trim(),
    };

    try {
      onSubmit(leadData);

      if (!isEditing) {
        setFormData({ ...INITIAL_FORM });
      }

      setErrors({});
      setSuccessMessage(
        isEditing ? "Lead updated successfully." : "Lead added successfully.",
      );
    } catch (error) {
      setErrors({
        form: error.message || "Unable to save the lead.",
      });
    }
  }

  return (
    <section className="lead-form-card">
      <div className="lead-form-heading">
        <div>
          <h3>{isEditing ? "Edit Lead" : "Add New Lead"}</h3>
          <p>Enter the contact details below. Fields marked * are required.</p>
        </div>
      </div>

      {successMessage && (
        <p className="form-success" role="status">
          {successMessage}
        </p>
      )}

      {errors.form && (
        <p className="form-error" role="alert">
          {errors.form}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="lead-form-grid">
          <div className="form-field">
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              required
            />
            {errors.firstName && (
              <span className="form-error">{errors.firstName}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="lastName">Last Name *</label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              required
            />
            {errors.lastName && (
              <span className="form-error">{errors.lastName}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              required
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="company">Company *</label>
            <input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              autoComplete="organization"
              aria-invalid={Boolean(errors.company)}
              required
            />
            {errors.company && (
              <span className="form-error">{errors.company}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="jobTitle">Job Title</label>
            <input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Enter job title (optional)"
            />
          </div>

          <div className="form-field">
            <label htmlFor="source">Lead Source *</label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
            >
              {SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="status">Lead Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lead-form-actions">
          {onCancel && (
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          )}

          <button type="submit" className="save-button">
            {isEditing ? "Update Lead" : "Save Lead"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default LeadForm;
