// Basic example
export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      style={{
        padding: "0.5rem 1rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
