import Link from "next/link";

// TODO: swap for the official Prolific Properties logo file once shared.
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Prolific Properties home">
      <span
        className={`grid size-10 place-items-center rounded-xl ${light ? "bg-white text-brand-700" : "bg-brand-600 text-white"}`}
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M9 20v-8h4.5a2.5 2.5 0 0 1 0 5H9" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block text-lg font-extrabold tracking-[0.18em] ${light ? "text-white" : "text-ink"}`}>
          PROLIFIC
        </span>
        <span className={`block text-[10px] font-semibold tracking-[0.42em] ${light ? "text-brand-200" : "text-brand-600"}`}>
          PROPERTIES
        </span>
      </span>
    </Link>
  );
}
