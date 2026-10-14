import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-20 text-center md:py-32">
      <p className="text-sm font-semibold tracking-widest text-brand-600 uppercase">404</p>
      <h1 className="mt-3 text-4xl font-bold text-ink">This page doesn&apos;t exist</h1>
      <p className="mt-3 text-muted">The property may have been sold or the link is incorrect.</p>
      <Link href="/properties" className="mt-8 inline-block rounded-full bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
        Browse properties
      </Link>
    </div>
  );
}
