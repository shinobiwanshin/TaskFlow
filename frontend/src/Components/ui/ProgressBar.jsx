import React from "react";

export function ProgressBar({ value = 0, className = "" }) {
  return (
    <div className={`progress-bar ${className}`}>
      <div
        className="progress-fill"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export default ProgressBar;
