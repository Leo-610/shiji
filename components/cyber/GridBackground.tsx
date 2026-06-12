export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(91,159,212,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(91,159,212,0.12) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div
        className="absolute -top-1/3 -left-1/4 h-[640px] w-[640px] rounded-full opacity-[0.08] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(91,159,212,0.45) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[480px] w-[480px] rounded-full opacity-[0.06] blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(61,98,133,0.5) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
