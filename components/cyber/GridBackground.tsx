export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full opacity-15 blur-[100px]"
        style={{ background: "radial-gradient(circle, #bf00ff 0%, transparent 70%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.5) 2px, rgba(0,240,255,0.5) 4px)",
        }}
      />
    </div>
  );
}
