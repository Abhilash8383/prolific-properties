export const CATEGORIES = ["Apartment", "Villa", "Duplex", "Plot", "Commercial"] as const;
export const LISTING_TYPES = ["Sale", "Rent"] as const;
export const STATUSES = ["Ready to Move", "Under Construction", "New Launch"] as const;
export const FEATURE_GROUPS = ["Interior", "Outdoor", "Utilities", "Other"] as const;
export const PLACEMENTS = {
  spotlight: { short: "Hero", label: "Home page: rotating hero", hint: "Shown first in the hero rotation" },
  homeFeatured: { short: "Home", label: "Home page: Featured properties", hint: "Featured cards and hero rotation" },
  footer: { short: "Footer", label: "Footer: Featured list on every page", hint: "Up to 3 are shown" },
  pinned: { short: "Pinned", label: "Properties page: pinned to the top", hint: "Listed first when sorted by newest" },
} as const;
export type Placement = keyof typeof PLACEMENTS;

export type Category = (typeof CATEGORIES)[number];
export type ListingType = (typeof LISTING_TYPES)[number];
export type Status = (typeof STATUSES)[number];
export type FeatureGroup = (typeof FEATURE_GROUPS)[number];

export type PropertyVariant = {
  name: string;
  basePrice: string;
  price: string;
  units: number | null;
  soldOut?: boolean;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  sqftMax?: number;
  floorPlans?: { name: string; sqft: number; sqftMax?: number; price: string }[];
  parking: number;
  status: Status;
  availableFrom: string;
  description: string;
  features: Record<FeatureGroup, string[]>;
};

export type Property = {
  id: string;
  ref: number;
  slug: string;
  title: string;
  developer: string;
  category: Category;
  listingType: ListingType;
  status: Status;
  placements: Placement[];
  published: boolean;
  price: string;
  units: number | null;
  configurations: string;
  area: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  parking: number;
  availableFrom: string;
  rera: string;
  summary: string;
  description: string[];
  images: string[];
  features: Record<FeatureGroup, string[]>;
  floorPlans: { name: string; sqft: number; sqftMax?: number; price: number }[];
  variants?: PropertyVariant[];
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  content: string;
  author: string;
  category: string;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
};

export type Testimonial = { id: string; name: string; role: string; text: string; order: number };

export type Job = { id: string; title: string; type: string; location: string; text: string; open: boolean };

export type Settings = {
  siteName: string;
  tagline: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  hrEmail: string;
  address: string;
  hours: string;
  rera: string;
  social: { facebook: string; instagram: string; linkedin: string; youtube: string };
  hero: { title: string; highlight: string; subtitle: string };
  stats: { value: string; label: string }[];
  developers: string[];
  founder: { name: string; title: string; message: string };
};

export const ENQUIRY_TYPES = ["contact", "property", "tour", "career"] as const;
export const ENQUIRY_STATUSES = ["new", "contacted", "closed"] as const;

export type Enquiry = {
  id: string;
  type: (typeof ENQUIRY_TYPES)[number];
  status: (typeof ENQUIRY_STATUSES)[number];
  name: string;
  phone: string;
  email: string;
  message: string;
  subject: string;
  details: Record<string, string>;
  createdAt: string;
};
