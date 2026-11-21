export default function StaticGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(90deg, color-mix(in oklab, var(--color-accent) 8%, transparent) 1px, transparent 1px),
          linear-gradient(0deg, color-mix(in oklab, var(--color-accent) 8%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
      }}
    />
  );
}
