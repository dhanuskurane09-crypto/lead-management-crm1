// import "./App.css";

// function App() {
//   return (
//     <div className="app">
//       <header className="app-header">
//         <div className="brand">
//           <div className="brand-icon">L</div>
//           <div>
//             <h1>LeadFlow CRM</h1>
//             <p>Lead Management System</p>
//           </div>
//         </div>

//         <div className="header-label">Mini CRM</div>
//       </header>

//       <main className="main-content">
//         <section className="welcome-section">
//           <div>
//             <p className="eyebrow">OVERVIEW</p>
//             <h2>Lead Management Dashboard</h2>
//             <p className="subtitle">
//               Manage your business leads and track their progress from one
//               place.
//             </p>
//           </div>
//         </section>

//         <section className="dashboard-section">
//           <h3>Dashboard Summary</h3>

//           <div className="summary-grid">
//             <div className="summary-card">
//               <span className="summary-icon">▦</span>
//               <p>Total Leads</p>
//               <h4>0</h4>
//             </div>

//             <div className="summary-card">
//               <span className="summary-icon">＋</span>
//               <p>New Leads</p>
//               <h4>0</h4>
//             </div>

//             <div className="summary-card">
//               <span className="summary-icon">✓</span>
//               <p>Qualified Leads</p>
//               <h4>0</h4>
//             </div>

//             <div className="summary-card">
//               <span className="summary-icon">↗</span>
//               <p>Converted Leads</p>
//               <h4>0</h4>
//             </div>
//           </div>
//         </section>

//         <section className="leads-section">
//           <div className="section-heading">
//             <div>
//               <h3>All Leads</h3>
//               <p className="subtitle">
//                 View and manage your business contacts.
//               </p>
//             </div>
//           </div>

//           <div className="empty-state">
//             <div className="empty-icon">＋</div>
//             <h3>Your lead list is ready</h3>
//             <p>
//               Your leads will appear here when we implement the lead creation
//               feature.
//             </p>
//           </div>
//         </section>
//       </main>

//       <footer className="app-footer">
//         LeadFlow CRM · Lead Management Mini Project
//       </footer>
//     </div>
//   );
// }

// export default App;

import "./App.css";
import mockLeads from "./data/mockLeads";

const summaryItems = [
  {
    label: "Total Leads",
    icon: "▦",
    getCount: (leads) => leads.length,
  },
  {
    label: "New Leads",
    icon: "＋",
    getCount: (leads) =>
      leads.filter((lead) => lead.status === "New").length,
  },
  {
    label: "Qualified Leads",
    icon: "✓",
    getCount: (leads) =>
      leads.filter((lead) => lead.status === "Qualified").length,
  },
  {
    label: "Converted Leads",
    icon: "↗",
    getCount: (leads) =>
      leads.filter((lead) => lead.status === "Converted").length,
  },
];

function App() {
  const leads = mockLeads;

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">L</div>
          <div>
            <h1>LeadFlow CRM</h1>
            <p>Lead Management System</p>
          </div>
        </div>

        <div className="header-label">Mini CRM</div>
      </header>

      <main className="main-content">
        <section className="welcome-section">
          <p className="eyebrow">OVERVIEW</p>
          <h2>Lead Management Dashboard</h2>
          <p className="subtitle">
            Manage your business leads and track their progress
            from one place.
          </p>
        </section>

        <section className="dashboard-section">
          <h3>Dashboard Summary</h3>

          <div className="summary-grid">
            {summaryItems.map((item) => (
              <div className="summary-card" key={item.label}>
                <span className="summary-icon">{item.icon}</span>
                <p>{item.label}</p>
                <h4>{item.getCount(leads)}</h4>
              </div>
            ))}
          </div>
        </section>

        <section className="leads-section">
          <div className="section-heading">
            <div>
              <h3>All Leads</h3>
              <p className="subtitle">
                View your sample business contacts.
              </p>
            </div>
            <span className="header-label">
              {leads.length} records
            </span>
          </div>

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
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <strong>
                        {lead.firstName} {lead.lastName}
                      </strong>
                    </td>
                    <td>{lead.email}</td>
                    <td>{lead.company}</td>
                    <td>{lead.jobTitle}</td>
                    <td>{lead.source}</td>
                    <td>
                      <span
                        className={`status-badge status-${lead.status.toLowerCase()}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        LeadFlow CRM · Lead Management Mini Project
      </footer>
    </div>
  );
}

export default App;
