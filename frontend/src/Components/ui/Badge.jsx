import React from "react";

export function Badge({ children, className = "", variant = "default" }) {
  const variants = {
    default: "badge-default",
    secondary: "badge-secondary",
    outline: "badge-outline",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
  };

  return (
    <span
      className={`badge ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
