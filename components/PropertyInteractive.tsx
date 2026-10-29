"use client";

import Image from "next/image";
import { useActionState, useState, useSyncExternalStore } from "react";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Link2, Printer, User, Video } from "lucide-react";
import { Facebook, WhatsApp } from "./icons";
import { inputClass } from "./ui";
import { submitEnquiry } from "@/app/(site)/actions";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="aspect-16/10 rounded-3xl bg-surface" />;
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_12rem]">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-surface sm:aspect-16/10 sm:rounded-3xl">
        <Image src={images[active]} alt={title} fill loading="eager" sizes="(min-width:1024px) 66vw, 100vw" className="object-cover" />
        {images.length > 1 &&
          ([
            [-1, "left-3", ChevronLeft, "Previous photo"],
            [1, "right-3", ChevronRight, "Next photo"],
          ] as const).map(([step, pos, Icon, label]) => (
            <button
              key={label}
              aria-label={label}
              onClick={() => setActive((active + step + images.length) % images.length)}
              className={`absolute top-1/2 ${pos} grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-white`}
            >
              <Icon className="size-5" />
            </button>
          ))}
        <span className="absolute right-4 bottom-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {active + 1} / {images.length}
        </span>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto sm:gap-3 md:flex-col md:overflow-y-auto">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            aria-label={`View photo ${i + 1} of ${images.length}`}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={`relative aspect-4/3 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition sm:w-28 sm:rounded-2xl md:w-full ${
              i === active ? "ring-brand-600" : "opacity-70 ring-transparent hover:opacity-100"
            }`}
          >
            <Image src={src} alt="" fill sizes="200px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ShareActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const btn = "grid size-10 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-brand-300 hover:text-brand-700";
  return (
    <div className="flex gap-2">
      <button className={btn} aria-label="Share on WhatsApp" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${location.href}`)}`)}>
        <WhatsApp className="size-4" />
      </button>
      <button className={btn} aria-label="Share on Facebook" onClick={() => window.open(`https://www.facebook.com/sharer.php?u=${encodeURIComponent(location.href)}`)}>
        <Facebook className="size-4" />
      </button>
      <button
        className={btn}
        aria-label="Copy link"
        onClick={() => {
          navigator.clipboard.writeText(location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check className="size-4 text-brand-600" /> : <Link2 className="size-4" />}
      </button>
      <button className={btn} aria-label="Print" onClick={() => print()}>
        <Printer className="size-4" />
      </button>
    </div>
  );
}

const times = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
const noop = () => () => {};

export function ScheduleTour({ title }: { title: string }) {
  const today = useSyncExternalStore(noop, () => new Date().toDateString(), () => null);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(times[0]);
  const [mode, setMode] = useState<"In person" | "Video chat">("In person");

  const days = today
    ? Array.from({ length: 10 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i + 1);
        return d;
      })
    : [];

  const [state, action, pending] = useActionState(submitEnquiry, null);

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-brand-50 p-6 text-center">
        <CheckCircle2 className="size-9 text-brand-600" />
        <p className="font-semibold text-ink">Tour requested</p>
        <p className="text-sm text-muted">We&apos;ll call you to confirm your visit.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="_type" value="tour" />
      <input type="hidden" name="_subject" value={`Tour request: ${title}`} />
      <input type="hidden" name="Date" value={days[day]?.toDateString() ?? ""} />
      <input type="hidden" name="Time" value={time} />
      <input type="hidden" name="Mode" value={mode} />
      <div className="no-scrollbar -mx-1 flex min-h-[4.5rem] gap-2 overflow-x-auto px-1">
        {days.map((d, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setDay(i)}
            className={`w-16 shrink-0 rounded-xl border py-2 text-center transition ${
              i === day ? "border-brand-600 bg-brand-600 text-white" : "border-line text-ink hover:border-brand-300"
            }`}
          >
            <span className="block text-[11px] uppercase opacity-70">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
            <span className="block text-lg font-bold">{d.getDate()}</span>
            <span className="block text-[11px] opacity-70">{d.toLocaleDateString("en-IN", { month: "short" })}</span>
          </button>
        ))}
      </div>
      <select value={time} onChange={(e) => setTime(e.target.value)} aria-label="Preferred tour time" className={inputClass}>
        {times.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-2">
        {(["In person", "Video chat"] as const).map((m) => (
          <button
            type="button"
            key={m}
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium ${
              mode === m ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted"
            }`}
          >
            {m === "In person" ? <User className="size-4" /> : <Video className="size-4" />} {m}
          </button>
        ))}
      </div>
      <input name="Your name" aria-label="Your name" required placeholder="Your name *" className={inputClass} />
      <input name="Mobile" aria-label="Mobile number" type="tel" required placeholder="Mobile *" className={inputClass} />
      {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-xl bg-ink py-3.5 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60">
        {pending ? "Sending..." : "Schedule a tour"}
      </button>
    </form>
  );
}
