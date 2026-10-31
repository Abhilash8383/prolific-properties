import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center ${light ? "rounded-xl bg-white px-2 py-1.5" : ""}`}
      aria-label="Prolific Properties home"
    >
      <Image
        src="/brand/prolific-logo.png"
        alt="Prolific Properties"
        width={1200}
        height={336}
        className={compact ? "h-11 w-auto sm:h-12 lg:h-9" : "h-11 w-auto sm:h-12"}
      />
    </Link>
  );
}
