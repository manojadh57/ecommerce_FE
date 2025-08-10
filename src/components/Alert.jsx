import React from "react";

export default function Alert({ variant = "info", children, className = "" }) {
  return (
    <div className={`alert alert-${variant} ${className}`} role="alert">
      {children}
    </div>
  );
}
