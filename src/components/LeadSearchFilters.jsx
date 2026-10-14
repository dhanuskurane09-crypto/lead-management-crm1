import "./LeadSearchFilters.css";

function LeadSearchFilters({
  search,
  setSearch,
  status,
  setStatus,
  source,
  setSource,
  onReset,
}) {
  return (
    <section className="lead-filters">
      <div className="filter-field search-field">
        <label htmlFor="lead-search">Search leads</label>
        <input
          id="lead-search"
          type="search"
          placeholder="Search name, email or company..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="status-filter">Filter by status</label>
        <select
          id="status-filter"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Converted">Converted</option>
          <option value="Disqualified">Disqualified</option>
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="source-filter">Filter by source</label>
        <select
          id="source-filter"
          value={source}
          onChange={(event) => setSource(event.target.value)}
        >
          <option value="">All sources</option>
          <option value="Website">Website</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Referral">Referral</option>
          <option value="Event">Event</option>
          <option value="Outbound">Outbound</option>
        </select>
      </div>

      <button
        type="button"
        className="cancel-button filter-reset"
        onClick={onReset}
      >
        Clear Filters
      </button>
    </section>
  );
}

export default LeadSearchFilters;
