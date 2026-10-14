import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { inputClass } from "@/components/ui";

function Label({ label, hint, children, className = "" }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`grid gap-1.5 text-sm font-medium text-ink ${className}`}>
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

type Common = { label: string; hint?: string; wrapClass?: string };

export function Input({ label, hint, wrapClass, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Label label={label} hint={hint} className={wrapClass}>
      <input className={inputClass} {...props} />
    </Label>
  );
}

export function Textarea({ label, hint, wrapClass, ...props }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Label label={label} hint={hint} className={wrapClass}>
      <textarea className={inputClass} rows={4} {...props} />
    </Label>
  );
}

export function Select({
  label,
  hint,
  wrapClass,
  options,
  ...props
}: Common & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[] }) {
  return (
    <Label label={label} hint={hint} className={wrapClass}>
      <select className={inputClass} {...props}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </Label>
  );
}

export function Checkbox({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-medium text-ink">
      <input type="checkbox" className="size-4 rounded accent-brand-600" {...props} />
      {label}
    </label>
  );
}

export function Panel({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
      <h2 className="font-semibold text-ink">{title}</h2>
      {text && <p className="mt-1 text-sm text-muted">{text}</p>}
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

export function PageHeader({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {text && <p className="mt-1 text-sm text-muted">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60";
export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-300";
