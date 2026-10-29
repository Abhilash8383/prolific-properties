import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface p-5">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-xl shadow-brand-900/5">
        <Image src="/brand/prolific-logo.png" alt="Prolific Properties" width={1200} height={336} className="h-12 w-auto" />
        <span className="mt-3 block text-[10px] font-semibold tracking-[0.42em] text-brand-600">ADMIN PANEL</span>
        <h1 className="mt-8 text-2xl font-bold text-ink">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Manage properties, enquiries, blog and site settings.</p>
        <LoginForm />
      </div>
    </div>
  );
}
