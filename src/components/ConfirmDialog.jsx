import React from "react";

function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(34,30,51,0.32)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{
        background: "white", padding: "2em 2.5em", borderRadius: 14, minWidth: 320,
        boxShadow: "0 4px 24px #3332", display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <h3 style={{ margin: "0 0 14px", color: "#432979" }}>{title || "Confirm"}</h3>
        <p style={{ marginBottom: "2em", color: "#1a1a1a" }}>{message}</p>
        <div>
          <button style={{
            background: "#eb3f31", color: "white", border: "none", borderRadius: 7,
            padding: "0.55em 1.45em", fontWeight: 600, marginRight: 12, cursor: "pointer"
          }} onClick={onConfirm}>Delete</button>
          <button style={{
            background: "#f3f1fa", color: "#211a31", border: "1.5px solid #857ccd", borderRadius: 7,
            padding: "0.55em 1.45em", fontWeight: 600, cursor: "pointer"
          }} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
