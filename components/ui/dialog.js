export function Dialog({ open, onOpenChange, children }) {

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex", // 🆕 center content horizontally and vertically
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "1rem", // optional, keeps content from touching edges on mobile
        boxSizing: "border-box", // optional, ensures padding is respected
        zIndex: 1000, // 🔥 Add this line
      }}
      onClick={() => onOpenChange(false)}
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
      className={`w-full max-w-md sm:max-w-lg bg-white rounded-lg shadow-xl p-4 ${className}`}
      style={{
        position: "relative", // ensures zIndex applies
        zIndex: 100,           // ✅ this ensures it's above the token
        ...style,             // keeps user-passed styles working
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

