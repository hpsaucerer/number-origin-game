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
