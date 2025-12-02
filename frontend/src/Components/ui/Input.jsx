import React from "react";

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  icon,
  ...props
}) {
  return (
    <div className={`input-wrapper ${className}`}>
      {icon && <span className="input-icon">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input ${icon ? "has-icon" : ""}`}
        {...props}
      />
    </div>
  );
}

export default Input;
