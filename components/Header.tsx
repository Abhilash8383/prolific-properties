"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { headerNav } from "@/lib/site";

export function Header({ phone }: { phone: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur-lg">
      <div className="container-x flex h-18 items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {headerNav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(n.href) ? "bg-brand-50 text-brand-700" : "text-muted hover:text-ink"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <a
          href={`tel:${phone}`}
          className="hidden items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 lg:inline-flex"
        >
          <Phone className="size-4" /> {phone}
        </a>
        <div className="flex items-center gap-1 lg:hidden">
          <a href={`tel:${phone}`} className="rounded-lg p-2 text-brand-700" aria-label={`Call ${phone}`}>
            <Phone className="size-5" />
          </a>
          <button className="rounded-lg p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-white shadow-xl shadow-brand-900/10 lg:hidden">
          <div className="container-x flex flex-col py-3">
            {headerNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-3 font-medium ${isActive(n.href) ? "bg-brand-50 text-brand-700" : "text-ink"}`}
              >
                {n.label}
              </Link>
            ))}
            <a href={`tel:${phone}`} className="mt-2 rounded-full bg-brand-600 px-5 py-3 text-center font-semibold text-white">
              Call {phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
