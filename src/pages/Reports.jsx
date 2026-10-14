import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import "../styles/Reports.css";

const STATUSES = ["New", "Contacted", "Qualified", "Converted", "Disqualified"];

const SOURCES = ["Website", "LinkedIn", "Referral", "Event", "Outbound"];

const COLORS = ["#6C63FF", "#22B8A7", "#F5A623", "#F06A8B", "#9B8AFB"];

const PERIODS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "All time", value: "all" },
];

function getStatus(lead) {
  return (
    STATUSES.find(
      (status) =>
        status.toLowerCase() === String(lead.status || "").toLowerCase(),
    ) || "New"
  );
}

function getSource(lead) {
  return lead.source || "Other";
}

function getCreatedDate(lead) {
  const value =
    lead.createdAt || lead.createdDate || lead.created_at || lead.dateCreated;

  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function downloadCSV(rows) {
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Company",
    "Source",
    "Status",
    "Created Date",
  ];

  const escapeCSV = (value) => {
    let text = String(value ?? "");

    // Prevent spreadsheet formula injection.
    if (/^[\s]*[=+\-@\t\r]/.test(text)) {
      text = "'" + text;
    }

    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((lead) =>
      [
        lead.firstName,
        lead.lastName,
        lead.email,
        lead.company,
        lead.source,
        lead.status,
        getCreatedDate(lead) ? formatDate(getCreatedDate(lead)) : "",
      ]
        .map(escapeCSV)
        .join(","),
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "lead-analytics-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function Reports({ leads = [] }) {
  const [period, setPeriod] = useState("30");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [search, setSearch] = useState("");

  const safeLeads = Array.isArray(leads) ? leads : [];

  const filteredLeads = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);

    if (period !== "all") {
      cutoff.setDate(now.getDate() - Number(period) + 1);
      cutoff.setHours(0, 0, 0, 0);
    }

    return safeLeads.filter((lead) => {
      const created = getCreatedDate(lead);

      // Date filters apply only to leads with a valid creation date.
      const matchesPeriod =
        period === "all" || (created && created >= cutoff && created <= now);

      const matchesStatus =
        statusFilter === "All" || getStatus(lead) === statusFilter;

      const matchesSource =
        sourceFilter === "All" || getSource(lead) === sourceFilter;

      const searchText = [
        lead.firstName,
        lead.lastName,
        lead.email,
        lead.company,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase().trim());

      return matchesPeriod && matchesStatus && matchesSource && matchesSearch;
    });
  }, [safeLeads, period, statusFilter, sourceFilter, search]);

  const stats = useMemo(() => {
    const total = filteredLeads.length;
    const converted = filteredLeads.filter(
      (lead) => getStatus(lead) === "Converted",
    ).length;
    const qualified = filteredLeads.filter(
      (lead) => getStatus(lead) === "Qualified",
    ).length;
    const contacted = filteredLeads.filter(
      (lead) => getStatus(lead) === "Contacted",
    ).length;

    return {
      total,
      converted,
      qualified,
      contacted,
      conversionRate: total ? ((converted / total) * 100).toFixed(1) : "0.0",
    };
  }, [filteredLeads]);

  const statusData = useMemo(
    () =>
      STATUSES.map((status, index) => ({
        name: status,
        value: filteredLeads.filter((lead) => getStatus(lead) === status)
          .length,
        color: COLORS[index],
      })).filter((item) => item.value > 0),
    [filteredLeads],
  );

  const sourceData = useMemo(() => {
    const counts = {};

    filteredLeads.forEach((lead) => {
      const source = getSource(lead);
      counts[source] = (counts[source] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredLeads]);

  const trendData = useMemo(() => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        name: date.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        }),
        leads: 0,
        converted: 0,
      });
    }

    filteredLeads.forEach((lead) => {
      const created = getCreatedDate(lead);
      if (!created) return;

      const month = months.find(
        (item) =>
          item.year === created.getFullYear() &&
          item.month === created.getMonth(),
      );

      if (month) {
        month.leads += 1;
        if (getStatus(lead) === "Converted") {
          month.converted += 1;
        }
      }
    });

    return months;
  }, [filteredLeads]);

  const funnelData = useMemo(
    () =>
      ["New", "Contacted", "Qualified", "Converted"].map((status, index) => ({
        name: status,
        count: filteredLeads.filter((lead) => getStatus(lead) === status)
          .length,
        fill: COLORS[index],
      })),
    [filteredLeads],
  );

  const hasDatedLeads = filteredLeads.some((lead) => getCreatedDate(lead));

  return (
    <main className="reports-page">
      <section className="reports-heading">
        <div>
          <span className="reports-eyebrow">PERFORMANCE CENTER</span>
          <h1>Reports & Analytics</h1>
          <p>
            Understand your pipeline, lead sources, and conversion performance
            in one place.
          </p>
        </div>

        <button
          className="report-export-btn"
          onClick={() => downloadCSV(filteredLeads)}
        >
          <span aria-hidden="true">↓</span>
          Export CSV
        </button>
      </section>

      <section className="reports-toolbar">
        <div className="report-search">
          <span aria-hidden="true">⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search leads, email or company..."
            aria-label="Search leads"
          />
        </div>

        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          aria-label="Filter by date range"
        >
          {PERIODS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={sourceFilter}
          onChange={(event) => setSourceFilter(event.target.value)}
          aria-label="Filter by source"
        >
          <option value="All">All sources</option>
          {[...new Set([...SOURCES, ...safeLeads.map(getSource)])].map(
            (source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ),
          )}
        </select>
      </section>

      <section className="report-kpi-grid">
        <article className="report-kpi-card kpi-purple">
          <div className="kpi-top">
            <span>Total Leads</span>
            <span className="kpi-icon">♙</span>
          </div>
          <strong>{stats.total}</strong>
          <small>Leads matching your filters</small>
        </article>

        <article className="report-kpi-card kpi-green">
          <div className="kpi-top">
            <span>Converted Leads</span>
            <span className="kpi-icon">✓</span>
          </div>
          <strong>{stats.converted}</strong>
          <small>Successfully converted</small>
        </article>

        <article className="report-kpi-card kpi-orange">
          <div className="kpi-top">
            <span>Conversion Rate</span>
            <span className="kpi-icon">↗</span>
          </div>
          <strong>{stats.conversionRate}%</strong>
          <small>Converted / total leads</small>
        </article>

        <article className="report-kpi-card kpi-pink">
          <div className="kpi-top">
            <span>Qualified Leads</span>
            <span className="kpi-icon">◎</span>
          </div>
          <strong>{stats.qualified}</strong>
          <small>{stats.contacted} contacted leads</small>
        </article>
      </section>

      <section className="reports-chart-grid">
        <article className="report-panel report-trend-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Lead Growth</h2>
              <p>Monthly lead creation and conversions</p>
            </div>
            <span className="chart-tag">6 months</span>
          </div>

          {hasDatedLeads ? (
            <div className="report-chart trend-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="leadAreaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#6C63FF"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                    <linearGradient
                      id="convertedAreaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#22B8A7"
                        stopOpacity={0.24}
                      />
                      <stop
                        offset="95%"
                        stopColor="#22B8A7"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="#EAECF2"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#7D8495", fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#7D8495", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    name="New leads"
                    stroke="#6C63FF"
                    strokeWidth={3}
                    fill="url(#leadAreaGradient)"
                    activeDot={{ r: 5 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="converted"
                    name="Converted"
                    stroke="#22B8A7"
                    strokeWidth={3}
                    fill="url(#convertedAreaGradient)"
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="report-empty-chart">
              <span>▥</span>
              <strong>No date data available</strong>
              <p>
                Add a valid createdAt or createdDate field to your leads to
                display the monthly trend.
              </p>
            </div>
          )}
        </article>

        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Lead Status</h2>
              <p>Distribution across pipeline stages</p>
            </div>
          </div>

          {statusData.length > 0 ? (
            <div className="report-chart donut-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={66}
                    outerRadius={95}
                    paddingAngle={4}
                    cornerRadius={5}
                    stroke="none"
                  >
                    {statusData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="report-empty-chart">
              <strong>No leads to display</strong>
              <p>Add leads or change the selected filters.</p>
            </div>
          )}
        </article>

        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Lead Sources</h2>
              <p>Which channels bring in leads?</p>
            </div>
          </div>

          <div className="report-chart source-chart">
            {sourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sourceData}
                  layout="vertical"
                  margin={{ top: 6, right: 16, left: 12, bottom: 6 }}
                >
                  <CartesianGrid
                    stroke="#EAECF2"
                    strokeDasharray="4 4"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#7D8495", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={78}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#62697A", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name="Leads"
                    fill="#6C63FF"
                    radius={[0, 7, 7, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="report-empty-chart">
                <strong>No source data</strong>
                <p>Lead source counts will appear here.</p>
              </div>
            )}
          </div>
        </article>

        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Pipeline Overview</h2>
              <p>Lead count by current stage</p>
            </div>
          </div>

          <div className="report-funnel">
            {funnelData.map((item) => {
              const percentage = stats.total
                ? (item.count / stats.total) * 100
                : 0;

              return (
                <div className="funnel-row" key={item.name}>
                  <div className="funnel-label">
                    <span>
                      <i style={{ background: item.fill }} />
                      {item.name}
                    </span>
                    <strong>{item.count}</strong>
                  </div>
                  <div className="funnel-track">
                    <div
                      className="funnel-fill"
                      style={{
                        width: `${percentage}%`,
                        background: item.fill,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="funnel-note">
            <span>ⓘ</span>
            <p>
              Counts represent each lead's current status, not cumulative
              stage-to-stage movement.
            </p>
          </div>
        </article>
      </section>

      <section className="report-panel report-table-panel">
        <div className="report-panel-heading report-table-heading">
          <div>
            <h2>Lead Report</h2>
            <p>
              Showing {filteredLeads.length} matching lead
              {filteredLeads.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            className="report-text-btn"
            onClick={() => downloadCSV(filteredLeads)}
          >
            Export filtered data ↗
          </button>
        </div>

        <div className="report-table-wrap">
          <table className="report-data-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Company</th>
                <th>Source</th>
                <th>Status</th>
                <th>Created date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead, index) => {
                  const name =
                    [lead.firstName, lead.lastName].filter(Boolean).join(" ") ||
                    "Unnamed lead";

                  const status = getStatus(lead);
                  const created = getCreatedDate(lead);

                  return (
                    <tr key={lead.id ?? lead._id ?? lead.email ?? index}>
                      <td>
                        <div className="report-person">
                          <span className="report-avatar">
                            {name.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <strong>{name}</strong>
                            <small>{lead.email || "—"}</small>
                          </div>
                        </div>
                      </td>
                      <td>{lead.company || "—"}</td>
                      <td>{getSource(lead)}</td>
                      <td>
                        <span
                          className={`report-status status-${status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>{created ? formatDate(created) : "—"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="report-no-results">
                    No leads match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
