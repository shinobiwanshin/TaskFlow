import React from "react";

export function Tabs({ tabs, activeTab, onTabChange, children }) {
  return (
    <div className="tabs-container">
      <div className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`tab-item ${activeTab === tab.value ? "active" : ""}`}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">{children}</div>
    </div>
  );
}

export default Tabs;
