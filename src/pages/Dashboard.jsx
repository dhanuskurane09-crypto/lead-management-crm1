import SummaryCards from "../components/SummaryCards";
import "../styles/Dashboard.css";

function Dashboard({ leads = [], onAddLead, onEditLead, onDeleteLead }) {
  const recentLeads = [...leads]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )
    .slice(0, 5);

  const getInitials = (lead) =>
    `${lead.firstName?.[0] || ""}${lead.lastName?.[0] || ""}`.toUpperCase();

  const getStatusClass = (status) =>
    (status || "New").toLowerCase().replace(/\s+/g, "-");

  return (
    <main className="dashboard-page">
      {/* Dashboard header */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-text">
          <span className="dashboard-eyebrow">LEADFLOW CRM / OVERVIEW</span>

          <h1>Lead Management Dashboard</h1>

          <p>
            Manage your business leads, monitor progress, and keep all your
            contacts organized in one place.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-primary-button"
          onClick={onAddLead}
        >
          <span aria-hidden="true">＋</span> Add New Lead
        </button>
      </section>

      {/* Summary cards */}
      <SummaryCards leads={leads} />

      {/* Recent leads table */}
      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <h2>Recent Leads</h2>
            <p>Your five most recently created leads.</p>
          </div>

          <span className="dashboard-count">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
          </span>
        </div>

        <div className="dashboard-table-scroll">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>CONTACT</th>
                <th>COMPANY</th>
                <th>SOURCE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="dashboard-contact">
                        <div className="dashboard-avatar">
                          {getInitials(lead) || "L"}
                        </div>

                        <div className="dashboard-contact-details">
                          <strong>
                            {lead.firstName} {lead.lastName}
                          </strong>
                          <span>{lead.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>{lead.company || "—"}</td>
                    <td>{lead.source || "—"}</td>

                    <td>
                      <span
                        className={`dashboard-status status-${getStatusClass(
                          lead.status,
                        )}`}
                      >
                        {lead.status || "New"}
                      </span>
                    </td>

                    <td>
                      <div className="dashboard-action-buttons">
                        {/* Edit icon with hover label */}
                        <button
                          type="button"
                          className="dashboard-icon-button dashboard-edit-button"
                          onClick={() => onEditLead(lead)}
                          aria-label={`Edit ${lead.firstName} ${lead.lastName}`}
                          title="Edit"
                        >
                          <svg
                            className="action-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                          </svg>

                          <span className="action-tooltip">Edit</span>
                        </button>

                        {/* Delete icon with hover label */}
                        <button
                          type="button"
                          className="dashboard-icon-button dashboard-delete-button"
                          onClick={() => onDeleteLead(lead.id)}
                          aria-label={`Delete ${lead.firstName} ${lead.lastName}`}
                          title="Delete"
                        >
                          <svg
                            className="action-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="m5 6 1 14h12l1-14" />
                            <path d="M10 10v6M14 10v6" />
                          </svg>

                          <span className="action-tooltip">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="dashboard-empty-state">
                      <div className="dashboard-empty-icon">＋</div>
                      <h3>No leads yet</h3>
                      <p>Add your first lead to see it on your dashboard.</p>

                      <button
                        type="button"
                        className="dashboard-primary-button"
                        onClick={onAddLead}
                      >
                        Add Your First Lead
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="dashboard-panel-footer">
          Showing {recentLeads.length} of {leads.length} leads
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
