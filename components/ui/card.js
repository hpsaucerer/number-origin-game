export function Card({ children, ...props }) {
  return (
    <div
      {...props}
      style={{
        border: "2px solid #3B82F6",
        borderRadius: "8px",
        padding: "1rem",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div style={{ margin: "1rem 0" }}>{children}</div>;
}
