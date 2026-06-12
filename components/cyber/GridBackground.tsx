export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 light:opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(var(--app-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--app-grid-line) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] rounded-full opacity-20 blur-[120px] light:opacity-40"
        style={{
          background:
            "radial-gradient(circle, var(--app-glow-primary) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full opacity-12 blur-[100px] light:opacity-30"
        style={{
          background:
            "radial-gradient(circle, var(--app-glow-secondary) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] light:opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, var(--app-grid-scan) 2px, var(--app-grid-scan) 4px)",
        }}
      />
    </div>
  );
}
