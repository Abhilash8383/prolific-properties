"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useActionState, useState, useTransition, type ReactNode } from "react";
import { BriefcaseBusiness, Building2, FileText, Inbox, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Settings, UserCog, X } from "lucide-react";
import { primaryButton } from "./fields";
import type { FormState } from "@/app/admin/actions";
import { MAX_UPLOAD_BYTES, isAcceptedImageType } from "@/lib/upload";

export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  className = "grid gap-6",
}: {
  action: (prev: FormState, f: FormData) => Promise<FormState>;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [uploadError, setUploadError] = useState("");
  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(event) => {
        const files = Array.from(event.currentTarget.querySelectorAll('input[type="file"]'))
          .flatMap((input) => Array.from(input.files ?? []));
        if (files.some((file) => !isAcceptedImageType(file.type))) {
          event.preventDefault();
          setUploadError("Choose JPG, PNG or WebP images only.");
        } else if (files.reduce((size, file) => size + file.size, 0) > MAX_UPLOAD_BYTES) {
          event.preventDefault();
          setUploadError("Choose photos totalling no more than 3.5 MB per save.");
        } else {
          setUploadError("");
        }
      }}
    >
      {children}
      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-4 bg-surface/90 px-1 py-3 backdrop-blur">
        <button disabled={pending} className={primaryButton}>
          {pending ? "Saving..." : submitLabel}
        </button>
        {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
        {uploadError && <p className="text-sm font-medium text-red-600">{uploadError}</p>}
        {state?.message && <p className="text-sm font-medium text-emerald-600">{state.message}</p>}
      </div>
    </form>
  );
}

export function ConfirmButton({
  action,
  confirm: question,
  children,
  className = "text-sm font-medium text-red-600 hover:underline",
}: {
  action: () => Promise<void>;
  confirm?: string;
  children: ReactNode;
  className?: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      className={`${className} disabled:opacity-50`}
      onClick={() => {
        if (question && !window.confirm(question)) return;
        start(async () => {
          await action();
          router.refresh();
        });
      }}
    >
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => Promise<void>; label: string }) {
  const [value, setValue] = useState(checked);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      disabled={pending}
      onClick={() => {
        setValue(!value);
        start(async () => {
          try {
            await onChange(!value);
          } catch {
            setValue(value);
          }
        });
      }}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${value ? "bg-brand-600" : "bg-line"}`}
    >
      <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition ${value ? "translate-x-5" : ""}`} />
    </button>
  );
}

export function ChipToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => Promise<void>; label: string }) {
  const [value, setValue] = useState(checked);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      aria-pressed={value}
      disabled={pending}
      onClick={() => {
        setValue(!value);
        start(async () => {
          try {
            await onChange(!value);
          } catch {
            setValue(value);
          }
        });
      }}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${value ? "bg-brand-600 text-white" : "bg-surface text-muted ring-1 ring-line hover:text-ink"}`}
    >
      {label}
    </button>
  );
}

const links = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", Icon: Building2 },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Inbox },
  { href: "/admin/blog", label: "Blog posts", Icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/admin/jobs", label: "Job openings", Icon: BriefcaseBusiness },
  { href: "/admin/settings", label: "Site settings", Icon: Settings },
  { href: "/admin/account", label: "My account", Icon: UserCog },
];

export function AdminNav({ email, newEnquiries, logout }: { email: string; newEnquiries: number; logout: () => Promise<void> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {links.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            active(href) ? "bg-white/10 text-white" : "text-white hover:bg-white/5"
          }`}
        >
          <Icon className="size-4.5" />
          {label}
          {href === "/admin/enquiries" && newEnquiries > 0 && (
            <span className="ml-auto rounded-full bg-brand-500 px-2 py-0.5 text-xs text-white">{newEnquiries}</span>
          )}
        </Link>
      ))}
      <div className="mt-auto border-t border-white/10 pt-4">
        <p className="truncate px-3 text-xs text-white">{email}</p>
        <div className="mt-2 flex gap-1">
          <Link href="/" target="_blank" className="flex-1 rounded-xl px-3 py-2 text-sm text-white hover:bg-white/5">
            View site
          </Link>
          <form action={logout}>
            <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white hover:bg-white/5">
              <LogOut className="size-4" /> Log out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between bg-brand-950 px-4 text-white lg:hidden">
        <Link href="/admin" className="flex items-center gap-2" aria-label="Prolific Properties admin home">
          <span className="rounded-md bg-white px-1.5 py-1">
            <Image src="/brand/prolific-logo.png" alt="Prolific Properties" width={1200} height={336} className="h-7 w-auto" />
          </span>
          <span className="text-xs font-semibold tracking-wider">ADMIN</span>
        </Link>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && <div className="fixed inset-x-0 top-14 bottom-0 z-40 flex flex-col overflow-y-auto bg-brand-950 p-4 lg:hidden">{nav}</div>}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col bg-brand-950 p-4 lg:flex">
        <Link href="/admin" className="mb-6 block rounded-xl bg-white p-3" aria-label="Prolific Properties admin home">
          <Image src="/brand/prolific-logo.png" alt="Prolific Properties" width={1200} height={336} className="h-auto w-full" />
          <span className="mt-2 block text-[10px] font-semibold tracking-[0.3em] text-brand-700">ADMIN PANEL</span>
        </Link>
        {nav}
      </aside>
    </>
  );
}
