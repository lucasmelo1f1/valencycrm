export function BackgroundGlows() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Blob 1 — top left */}
      <div
        className="absolute -top-48 -left-48 w-96 h-96 rounded-full opacity-[0.07]"
        style={{
          background: "#10B981",
          filter: "blur(100px)",
          animation: "morphBlob1 8s ease-in-out infinite alternate",
        }}
      />
      {/* Blob 2 — center right */}
      <div
        className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-[0.05]"
        style={{
          background: "#10B981",
          filter: "blur(120px)",
          animation: "morphBlob2 10s ease-in-out infinite alternate",
        }}
      />
      {/* Blob 3 — bottom center */}
      <div
        className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full opacity-[0.04]"
        style={{
          background: "#10B981",
          filter: "blur(100px)",
          animation: "morphBlob1 12s ease-in-out infinite alternate-reverse",
        }}
      />
    </div>
  );
}
