export function DialogContent({ children, className = "", style = {} }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`w-full max-w-md sm:max-w-lg bg-white rounded-lg shadow-xl p-4 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}


export function DialogOverlay({ className = "" }) {
  return (
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(6px)",
        zIndex: 40,
      }}
    />
  );
}

export function DialogContent({ children, className = "", style = {} }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={className}
      style={{
        background: "#fff",
        width: "100%",
        margin: "10% auto",
        padding: "1rem",
        borderRadius: "8px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div style={{ marginBottom: "0.5rem" }}>{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 style={{ marginBottom: "0.5rem" }}>{children}</h2>;
}
