"use client";

import React from "react";
import { useRouter } from "next/navigation";

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div style={overlayStyle}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="unauth-title"
        style={dialogStyle}
      >
        <h2 id="unauth-title" style={{ margin: 0 }}>
          Unauthorized Access
        </h2>
        <p style={{ marginTop: 8 }}>You must sign in to continue.</p>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
        >
          <button onClick={handleBackToLogin} style={buttonStyle}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const dialogStyle: React.CSSProperties = {
  background: "#fff",
  padding: "24px",
  borderRadius: 8,
  width: "90%",
  maxWidth: 420,
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const buttonStyle: React.CSSProperties = {
  background: "#0070f3",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: 6,
  cursor: "pointer",
};

export default UnauthorizedPage;
// ...existing code...
