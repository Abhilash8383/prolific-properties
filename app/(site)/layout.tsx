import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsApp } from "@/components/icons";
import { getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const s = await getSettings();
  return (
    <>
      <Header phone={s.phone} />
      <main className="flex-1">{children}</main>
      <Footer />
      <a
        href={whatsappLink(s.whatsapp, `Hi ${s.siteName}, I'd like to know more about your properties.`)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="wa-fab fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white shadow-xl transition hover:scale-105 sm:right-5 sm:bottom-5"
      >
        <WhatsApp className="size-6" />
        <span className="hidden sm:inline">Chat with us</span>
      </a>
    </>
  );
}
