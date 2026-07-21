import "./DashboardTabs.css";

function DashboardTabs({
  activeTab,
  onTabChange
}) {
  return (
    <div className="dashboard-tabs">

      <button
        className={activeTab === "overview" ? "active" : ""}
        onClick={() => onTabChange("overview")}
      >
        Overview
      </button>

      <button
        className={activeTab === "records" ? "active" : ""}
        onClick={() => onTabChange("records")}
      >
        Records
      </button>

      <button
        className={activeTab === "charts" ? "active" : ""}
        onClick={() => onTabChange("charts")}
      >
        Charts
      </button>

    </div>
  );
}

export default DashboardTabs;