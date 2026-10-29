export const headerNav = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = [
  ...headerNav,
  { href: "/blog", label: "Blog" },
  { href: "/career", label: "Career" },
];

export function whatsappLink(number: string, text: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export const img = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const services = [
  {
    icon: "Home",
    title: "Home Buying Consultancy",
    text: "Shortlist, compare and visit the right homes for your budget and lifestyle, with an advisor guiding every step.",
  },
  {
    icon: "HandCoins",
    title: "Home Loan Assistance",
    text: "Tie-ups with leading banks to get you the best rates, quick sanctions and paperwork handled end to end.",
  },
  {
    icon: "Plane",
    title: "NRI Consulting",
    text: "Invest, buy or sell property in India from anywhere in the world with full transparency and virtual tours.",
  },
  {
    icon: "Repeat",
    title: "Resale Services",
    text: "Get the right price for your property through verified buyers, smart pricing and targeted marketing.",
  },
  {
    icon: "Scale",
    title: "Legal Assistance",
    text: "In-house legal experts verify titles, approvals and agreements so every transaction is secure.",
  },
  {
    icon: "TrendingUp",
    title: "Investment Consultancy",
    text: "Data-driven advice on micro-markets, appreciation and rental yields to maximise your returns.",
  },
] as const;
