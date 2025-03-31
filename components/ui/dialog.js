export function Dialog({ open, onOpenChange, children }) {
  // Minimal example to show/hide a modal
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)"
      }}
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "80%",
          margin: "10% auto",
          padding: "1rem",
          borderRadius: "8px"
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ children }) {
  return <div>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div style={{ marginBottom: "0.5rem" }}>{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 style={{ marginBottom: "0.5rem" }}>{children}</h2>;
}
