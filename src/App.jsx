import { useEffect, useState } from "react";
import "./App.css";

import mockLeads from "./data/mockLeads";
import LeadForm from "./components/LeadForm";
import LeadSearchFilters from "./components/LeadSearchFilters";
import LeadTable from "./components/LeadTable";
import Pagination from "./components/Pagination";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";

const STORAGE_KEY = "leadflow-crm-leads";
const PAGE_SIZE = 5;

const LEAD_STATUS_TABS = [
  { label: "All Leads", value: "All" },
  { label: "New Leads", value: "New" },
  { label: "Qualified Leads", value: "Qualified" },
  { label: "Converted Leads", value: "Converted" },
];

function loadLeads() {
  try {
    const savedLeads = localStorage.getItem(STORAGE_KEY);

    if (savedLeads !== null) {
      const parsedLeads = JSON.parse(savedLeads);
      if (Array.isArray(parsedLeads)) return parsedLeads;
    }
  } catch (error) {
    console.error("Unable to load saved leads:", error);
  }

  return mockLeads.map((lead) => ({ ...lead }));
}

function createLeadId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function App() {
  const [leads, setLeads] = useState(loadLeads);
  const [activePage, setActivePage] = useState("dashboard");

  const [formMode, setFormMode] = useState(null);
  const [editingLead, setEditingLead] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState("All");
  const [popupMessage, setPopupMessage] = useState("");

  // Save all lead changes to LocalStorage.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (error) {
      console.error("Unable to save leads:", error);
    }
  }, [leads]);

  function clearFilters() {
    setSearch("");
    setStatus("");
    setSource("");
    setSelectedLeadStatus("All");
    setCurrentPage(1);
  }

  function openPage(page) {
    setActivePage(page);
    setFormMode(null);
    setEditingLead(null);
    setCurrentPage(1);
    setPopupMessage("");

    if (page === "leads") {
      clearFilters();
    }
  }

  function openAddLeadForm() {
    setActivePage("leads");
    setFormMode("add");
    setEditingLead(null);
    clearFilters();
    setPopupMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAddLead(leadData) {
    const email = (leadData.email || "").trim().toLowerCase();

    const duplicate = leads.some(
      (lead) => (lead.email || "").trim().toLowerCase() === email,
    );

    if (duplicate) {
      throw new Error("This email already exists.");
    }

    const newLead = {
      ...leadData,
      email,
      id: createLeadId(),
      createdAt: new Date().toISOString(),
    };

    setLeads((previousLeads) => [newLead, ...previousLeads]);
    setFormMode(null);
    setEditingLead(null);
    setActivePage("leads");
    clearFilters();
    setPopupMessage("Lead saved successfully!");
  }

  function handleEditLead(lead) {
    setEditingLead(lead);
    setFormMode("edit");
    setActivePage("leads");
    clearFilters();
    setPopupMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleUpdateLead(leadData) {
    if (!editingLead) return;

    const email = (leadData.email || "").trim().toLowerCase();

    const duplicate = leads.some(
      (lead) =>
        lead.id !== editingLead.id &&
        (lead.email || "").trim().toLowerCase() === email,
    );

    if (duplicate) {
      throw new Error("This email already exists.");
    }

    setLeads((previousLeads) =>
      previousLeads.map((lead) =>
        lead.id === editingLead.id
          ? {
              ...lead,
              ...leadData,
              email,
              id: lead.id,
              createdAt: lead.createdAt,
              updatedAt: new Date().toISOString(),
            }
          : lead,
      ),
    );

    setFormMode(null);
    setEditingLead(null);
    clearFilters();
    setPopupMessage("Lead updated successfully!");
  }

  function handleDeleteLead(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?",
    );

    if (!confirmed) return;

    setLeads((previousLeads) => previousLeads.filter((lead) => lead.id !== id));

    if (editingLead?.id === id) {
      setEditingLead(null);
      setFormMode(null);
    }

    setPopupMessage("Lead deleted successfully!");
  }

  function handleCancelForm() {
    setFormMode(null);
    setEditingLead(null);
  }

  function handleResetFilters() {
    clearFilters();
  }

  // Apply search, status tabs, and dropdown filters together.
  const filteredLeads = leads.filter((lead) => {
    const searchText = search.trim().toLowerCase();

    const fullName = `${lead.firstName || ""} ${lead.lastName || ""}`
      .trim()
      .toLowerCase();

    const matchesSearch =
      !searchText ||
      fullName.includes(searchText) ||
      (lead.email || "").toLowerCase().includes(searchText) ||
      (lead.company || "").toLowerCase().includes(searchText) ||
      (lead.jobTitle || "").toLowerCase().includes(searchText);

    const matchesSelectedStatus =
      selectedLeadStatus === "All" || lead.status === selectedLeadStatus;

    const matchesStatus = !status || lead.status === status;
    const matchesSource = !source || lead.source === source;

    return (
      matchesSearch && matchesSelectedStatus && matchesStatus && matchesSource
    );
  });

  // Keep pagination valid when filters or records change.
  const totalPages = Math.ceil(filteredLeads.length / PAGE_SIZE);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;

  const paginatedLeads = filteredLeads.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  function handlePageChange(page) {
    if (page >= 1 && page <= Math.max(totalPages, 1)) {
      setCurrentPage(page);
    }
  }

  return (
    <div className="app">
      {popupMessage && (
        <div className="popup-overlay" onClick={() => setPopupMessage("")}>
          <div
            className="success-popup"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="popup-success-icon">✓</div>
            <h2 id="popup-title">Success!</h2>
            <p>{popupMessage}</p>
            <button type="button" onClick={() => setPopupMessage("")} autoFocus>
              OK
            </button>
          </div>
        </div>
      )}

      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">L</div>
          <div>
            <h1>LeadFlow CRM</h1>
            <p>Lead Management System</p>
          </div>
        </div>

        <nav className="app-navigation" aria-label="Main navigation">
          <button
            type="button"
            className={
              activePage === "dashboard" ? "nav-button active" : "nav-button"
            }
            onClick={() => openPage("dashboard")}
          >
            <span aria-hidden="true">▦</span> Dashboard
          </button>

          <button
            type="button"
            className={
              activePage === "leads" ? "nav-button active" : "nav-button"
            }
            onClick={() => openPage("leads")}
          >
            <span aria-hidden="true">☷</span> All Leads
          </button>

          <button
            type="button"
            className={
              activePage === "reports" ? "nav-button active" : "nav-button"
            }
            onClick={() => openPage("reports")}
          >
            <span aria-hidden="true">▥</span> Reports
          </button>
        </nav>

        <div className="header-label">MINI CRM</div>
      </header>

      {activePage === "dashboard" && (
        <Dashboard
          leads={leads}
          onAddLead={openAddLeadForm}
          onEditLead={handleEditLead}
          onDeleteLead={handleDeleteLead}
        />
      )}

      {activePage === "reports" && <Reports leads={leads} />}

      {activePage === "leads" && (
        <main className="main-content leads-page">
          <nav className="lead-status-tabs" aria-label="Filter leads by status">
            {LEAD_STATUS_TABS.map((tab) => {
              const count =
                tab.value === "All"
                  ? leads.length
                  : leads.filter((lead) => lead.status === tab.value).length;

              return (
                <button
                  key={tab.value}
                  type="button"
                  className={
                    selectedLeadStatus === tab.value
                      ? "lead-status-tab active"
                      : "lead-status-tab"
                  }
                  aria-pressed={selectedLeadStatus === tab.value}
                  onClick={() => {
                    setSelectedLeadStatus(tab.value);
                    setStatus("");
                    setCurrentPage(1);
                  }}
                >
                  {tab.label}
                  <span className="lead-status-count">{count}</span>
                </button>
              );
            })}
          </nav>

          {formMode ? (
            <section className="leads-section">
              <div className="section-heading">
                <div>
                  <h2>{formMode === "edit" ? "Edit Lead" : "Add New Lead"}</h2>
                  <p className="subtitle">
                    {formMode === "edit"
                      ? "Update the selected lead details."
                      : "Enter the details to create a new lead."}
                  </p>
                </div>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancelForm}
                >
                  Back to Leads
                </button>
              </div>

              <LeadForm
                key={`${formMode}-${editingLead?.id || "new"}`}
                existingLeads={leads}
                initialData={formMode === "edit" ? editingLead : null}
                onSubmit={
                  formMode === "edit" ? handleUpdateLead : handleAddLead
                }
                onCancel={handleCancelForm}
              />
            </section>
          ) : (
            <section className="leads-section">
              <div className="section-heading all-leads-heading">
                <div>
                  <p className="eyebrow">LEAD MANAGEMENT</p>
                  <h2>All Leads</h2>
                  <p className="subtitle">
                    Track and organize all your leads in one place.
                  </p>
                </div>

                <button
                  type="button"
                  className="save-button add-lead-button"
                  onClick={openAddLeadForm}
                >
                  <span className="add-lead-icon" aria-hidden="true">
                    +
                  </span>
                  Add Lead
                </button>
              </div>

              <LeadSearchFilters
                search={search}
                setSearch={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
                status={status}
                setStatus={(value) => {
                  setStatus(value);
                  setCurrentPage(1);
                }}
                source={source}
                setSource={(value) => {
                  setSource(value);
                  setCurrentPage(1);
                }}
                onReset={handleResetFilters}
              />

              <LeadTable
                leads={paginatedLeads}
                onEdit={handleEditLead}
                onDelete={handleDeleteLead}
              />

              <div className="table-footer">
                <p className="records-count">
                  {filteredLeads.length === 0
                    ? "Showing 0 of 0 leads"
                    : `Showing ${startIndex + 1}–${Math.min(
                        startIndex + PAGE_SIZE,
                        filteredLeads.length,
                      )} of ${filteredLeads.length} leads`}
                </p>

                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={Math.max(totalPages, 1)}
                  onPageChange={handlePageChange}
                />
              </div>
            </section>
          )}
        </main>
      )}

      <footer className="app-footer">
        LeadFlow CRM · Lead Management Mini Project
      </footer>
    </div>
  );
}

export default App;
