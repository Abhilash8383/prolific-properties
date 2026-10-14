import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-[1.75rem] leading-tight font-bold tracking-tight text-ink sm:text-3xl md:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-muted">{text}</p>}
    </div>
  );
}

export function PageHero({ title, text, image }: { title: string; text: string; image: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950">
      <Image src={image} alt="" fill loading="eager" sizes="100vw" className="-z-10 object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-950 via-brand-950/80 to-brand-900/30" />
      <div className="container-x py-14 md:py-28">
        <nav className="flex items-center gap-1 text-sm text-brand-200">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-white">{title}</span>
        </nav>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-xl text-brand-100/80 md:text-lg">{text}</p>
      </div>
    </section>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";
