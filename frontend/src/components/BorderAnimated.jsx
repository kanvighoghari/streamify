function BorderAnimated({ children }) {
  return (
    <div
      className="w-full h-full rounded-2xl border border-transparent animate-border flex overflow-hidden"
      style={{ "--border-angle": "0deg",
               background: `linear-gradient(45deg, #172033, #1e293b 50%, #172033) padding-box,
                            conic-gradient(from var(--border-angle), rgba(100,116,139,0.48) 80%, #06b6d4 86%, #22d3ee 90%, #06b6d4 94%, rgba(100,116,139,0.48)) border-box` }}
    >
      {children}
    </div>
  );
}

export default BorderAnimated;
