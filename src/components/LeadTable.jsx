import "../styles/LeadTable.css";

function LeadTable({ leads = [], onEdit, onDelete }) {
  const getStatusClass = (status) =>
    (status || "New").toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="table-container">
      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Job Title</th>
            <th>Source</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <strong>
                    {lead.firstName} {lead.lastName}
                  </strong>
                </td>

                <td>{lead.email || "—"}</td>
                <td>{lead.company || "—"}</td>
                <td>{lead.jobTitle || "—"}</td>
                <td>{lead.source || "—"}</td>

                <td>
                  <span
                    className={`status-badge status-${getStatusClass(
                      lead.status,
                    )}`}
                  >
                    {lead.status || "New"}
                  </span>
                </td>

                <td>
                  <div className="lead-actions">
                    {/* Edit icon */}
                    <button
                      type="button"
                      className="lead-action-icon edit-button"
                      onClick={() => onEdit?.(lead)}
                      aria-label={`Edit ${lead.firstName} ${lead.lastName}`}
                      title="Edit lead"
                    >
                      <svg
                        className="lead-action-svg"
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
                      <span className="lead-action-tooltip">Edit</span>
                    </button>

                    {/* Delete icon */}
                    <button
                      type="button"
                      className="lead-action-icon delete-button"
                      onClick={() => onDelete?.(lead.id)}
                      aria-label={`Delete ${lead.firstName} ${lead.lastName}`}
                      title="Delete lead"
                    >
                      <svg
                        className="lead-action-svg"
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
                      <span className="lead-action-tooltip">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="empty-table-message">
                No leads found. Try changing your filters or add a lead.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;
