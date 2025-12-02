import React from "react";

export function Avatar({ src, alt, fallback, size = "md", className = "" }) {
  const sizes = {
    sm: "avatar-sm",
    md: "avatar-md",
    lg: "avatar-lg",
    xl: "avatar-xl",
  };

  return (
    <div className={`avatar ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={alt || "Avatar"} className="avatar-image" />
      ) : (
        <div className="avatar-fallback">{fallback}</div>
      )}
    </div>
  );
}

export default Avatar;
