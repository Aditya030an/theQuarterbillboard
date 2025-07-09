export default function CssGridIllusion() {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, #1a1a1a 1px, transparent 1px),
          linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)
        `,
        backgroundSize: "2px 2px",
      }}
    />
  );
}
