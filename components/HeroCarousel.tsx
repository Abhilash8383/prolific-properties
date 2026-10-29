"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export type HeroSlide = {
  slug: string;
  title: string;
  area: string;
  price: string;
  image: string;
};

export function HeroCarousel({
  slides,
  fallbackImage,
  propertyCount,
}: {
  slides: HeroSlide[];
  fallbackImage: string;
  propertyCount: number;
}) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const slide = slides[active];

  const show = useCallback((index: number) => {
    if (slides.length < 2 || index === active) return;
    setPrevious(active);
    setActive(index);
  }, [active, slides.length]);

  useEffect(() => {
    if (slides.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) show((active + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [active, paused, show, slides.length]);

  useEffect(() => {
    if (previous === null) return;
    const timer = window.setTimeout(() => setPrevious(null), 700);
    return () => window.clearTimeout(timer);
  }, [active, previous]);

  return (
    <div
      className="relative"
      role="region"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      aria-label={slides.length > 1 ? `Featured homes, slide ${active + 1} of ${slides.length}` : "Featured home"}
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-[2rem] bg-brand-600 shadow-2xl shadow-brand-950/10 lg:aspect-5/4">
        {previous !== null && (
          <Image
            src={slides[previous].image}
            alt=""
            fill
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        {slides.length > 1 && (
          <Image
            src={slides[(active + 1) % slides.length].image}
            alt=""
            fill
            loading="eager"
            sizes="(min-width:1024px) 50vw, 100vw"
            aria-hidden="true"
            className="pointer-events-none object-cover opacity-0"
          />
        )}
        <Image
          key={slide?.slug ?? "fallback"}
          src={slide?.image ?? fallbackImage}
          alt={slide?.title ?? "Featured home"}
          fill
          loading="eager"
          sizes="(min-width:1024px) 50vw, 100vw"
          className={`object-cover ${previous !== null ? "hero-slide-in" : ""}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-950/40 via-transparent to-transparent" />
      </div>

      {slides.length > 1 && (
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            type="button"
            onClick={() => show((active - 1 + slides.length) % slides.length)}
            aria-label="Previous featured home"
            className="grid size-9 place-items-center rounded-full bg-white/95 text-brand-600 shadow-lg transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => show((active + 1) % slides.length)}
            aria-label="Next featured home"
            className="grid size-9 place-items-center rounded-full bg-white/95 text-brand-600 shadow-lg transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}

      {propertyCount > 0 && (
        <span className="absolute top-4 right-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-brand-700 shadow-lg">
          <span className="sm:hidden">{propertyCount} homes</span>
          <span className="hidden sm:inline">{propertyCount} homes to explore</span>
        </span>
      )}

      {slide && (
        <Link
          href={`/properties/${slide.slug}`}
          className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur sm:right-6 sm:bottom-6 sm:left-auto sm:min-w-72 sm:p-4"
        >
          <div>
            <p className="text-xs font-semibold text-brand-600">Featured home</p>
            <p className="mt-1 font-semibold text-ink">{slide.title}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted"><MapPin className="size-3" /> {slide.area} · {slide.price}</p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-600 text-white"><ArrowRight className="size-4" /></span>
        </Link>
      )}
    </div>
  );
}
