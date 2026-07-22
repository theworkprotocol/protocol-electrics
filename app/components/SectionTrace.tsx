/**
 * Decorative circuit trace for page headers — a thin flowing current with
 * junction nodes, echoing the homepage hero motif. Server component; the
 * animation runs on the .circuit-path / .circuit-node CSS classes.
 */
export default function SectionTrace({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 28"
      fill="none"
      aria-hidden="true"
      className={`h-6 w-full max-w-sm ${className}`}
      preserveAspectRatio="xMinYMid meet"
    >
      {/* Faint base trace */}
      <path
        d="M 2,14 H 150 L 168,4 H 260 L 278,14 H 418"
        stroke="rgba(245,166,35,0.12)"
        strokeWidth="1.5"
      />
      {/* Flowing current */}
      <path
        d="M 2,14 H 150 L 168,4 H 260 L 278,14 H 418"
        stroke="rgba(245,166,35,0.5)"
        strokeWidth="1.5"
        className="circuit-path"
      />
      {/* Junction nodes */}
      <circle className="circuit-node" cx="150" cy="14" r="3" fill="#F5A623" />
      <circle className="circuit-node" cx="278" cy="14" r="3" fill="#F5A623" />
    </svg>
  );
}
