import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { socials } from "./icons";
import { footerNav } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { getProperties, getSettings } from "@/lib/data";

export async function Footer() {
  const [site, properties] = await Promise.all([getSettings(), getProperties()]);
  return (
    <footer className="bg-brand-950 text-white">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:py-16 lg:grid-cols-4 lg:gap-12">
        <div className="col-span-2 space-y-5 lg:col-span-1">
          <div className="space-y-2">
            <Logo light />
            <p className="text-xs text-white/80">A Unit of Prolific Ideas Consulting Services</p>
          </div>
          <p className="text-sm leading-relaxed">{site.description}</p>
          <div className="flex gap-2">
            {socials.filter(({ key }) => site.social[key]).map(({ key, label, Icon }) => (
              <a
                key={key}
                href={site.social[key]}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-brand-600"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-semibold tracking-widest text-white uppercase">Quick links</h3>
          <ul className="space-y-3 text-sm">
            {footerNav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="order-last col-span-2 lg:order-none lg:col-span-1">
          <h3 className="mb-5 text-sm font-semibold tracking-widest text-white uppercase">Contact</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="size-4 shrink-0 text-white" /> {site.address}
            </li>
            <li>
              <a href={`tel:${site.phone}`} className="flex gap-3 hover:text-white">
                <Phone className="size-4 text-white" /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex gap-3 break-all hover:text-white">
                <Mail className="size-4 text-white" /> {site.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-semibold tracking-widest text-white uppercase">Featured</h3>
          <ul className="space-y-4">
            {properties
              .filter((p) => p.placements.includes("footer"))
              .slice(0, 3)
              .map((p) => (
                <li key={p.slug}>
                  <Link href={`/properties/${p.slug}`} prefetch className="group block">
                    <span className="block text-sm font-medium text-white group-hover:underline">{p.title}</span>
                    <span className="text-xs">
                      {formatPrice(p)} onwards · {p.area}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col justify-between gap-3 py-6 text-xs sm:flex-row">
          <p>
            © {site.siteName}. All rights reserved. · {site.rera}
          </p>
          <div className="flex gap-5">
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
