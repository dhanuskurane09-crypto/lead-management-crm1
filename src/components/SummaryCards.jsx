const summaryItems = [
  {
    label: "Total Leads",
    icon: "▦",
    className: "total",
    getCount: (leads) => leads.length,
  },
  {
    label: "New Leads",
    icon: "＋",
    className: "new",
    getCount: (leads) => leads.filter((lead) => lead.status === "New").length,
  },
  {
    label: "Qualified Leads",
    icon: "✓",
    className: "qualified",
    getCount: (leads) =>
      leads.filter((lead) => lead.status === "Qualified").length,
  },
  {
    label: "Converted Leads",
    icon: "↗",
    className: "converted",
    getCount: (leads) =>
      leads.filter((lead) => lead.status === "Converted").length,
  },
];

function SummaryCards({ leads = [] }) {
  return (
    <section className="dashboard-summary-section">
      {/* <div className="dashboard-summary-heading">
        <h2>Dashboard Summary</h2>
        <p>Here is an overview of your lead pipeline.</p>
      </div> */}

      <div className="dashboard-summary-grid">
        {summaryItems.map((item) => (
          <article className="dashboard-summary-card" key={item.label}>
            <div className={`dashboard-summary-icon ${item.className}`}>
              {item.icon}
            </div>

            <p>{item.label}</p>
            <h3>{item.getCount(leads)}</h3>
            <span className="dashboard-card-caption">
              Updated from your lead records
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SummaryCards;
