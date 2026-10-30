// Usage: npm run seed  (wipes and re-creates all site content; enquiries are kept)
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error("Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");

const img = (id: string) => `https://images.unsplash.com/photo-${id}`;
const interiors = [
  "1600607687939-ce8a6c25118c",
  "1600566753190-17f0baa2a6c3",
  "1556909114-f6e7ad7d3136",
  "1584622650111-993a426fbf0a",
  "1522708323590-d24dbb6b0267",
  "1616594039964-ae9021a400a0",
  "1502672260266-1c1ef2d93688",
  "1560448204-e02f11c3d0e2",
  "1493809842364-78817add7ffb",
  "1600210492486-724fe5c67fb0",
  "1600573472550-8090b5e0745e",
  "1600566752355-35792bedcfea",
].map(img);
const pick = (i: number, n = 4) => Array.from({ length: n }, (_, k) => interiors[(i * 3 + k) % interiors.length]);

const apartmentFeatures = {
  Interior: ["Clubhouse", "Gym", "Indoor Games"],
  Outdoor: ["Swimming Pool", "Jogging Track", "Kids Play Area"],
  Utilities: ["24x7 Power Backup", "Water Treatment", "Rainwater Harvesting"],
  Other: ["Elevator", "Gated Community", "CCTV Security"],
};

type Seed = {
  title: string;
  developer: string;
  category: string;
  listingType?: string;
  status: string;
  featured?: boolean;
  price: number;
  configurations: string;
  area: string;
  city?: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  parking: number;
  availableFrom: string;
  cover: string;
  extra?: string[];
  summary: string;
  description: string[];
  features?: Record<string, string[]>;
  floorPlans: [string, number, number][];
};

const seeds: Seed[] = [
  {
    title: "Skyline Ariana Residences", developer: "Tata Housing", category: "Apartment", status: "Ready to Move", featured: true,
    price: 9900000, configurations: "2 & 3 BHK", area: "Kalinga Nagar", bedrooms: 3, bathrooms: 2, sqft: 1325, parking: 1,
    availableFrom: "Immediate", cover: "1545324418-cc1a3fa10c00",
    summary: "A ready-to-move township blending generous green spaces with modern, community-focused living.",
    description: [
      "Skyline Ariana Residences is a premium, ready-to-move township set across acres of landscaped greens in Kalinga Nagar, one of Bhubaneswar's fastest growing corridors.",
      "Thoughtfully planned 2 and 3 BHK homes offer cross ventilation, large balconies and efficient layouts, while the clubhouse, jogging tracks and kids' play zones make everyday living effortless.",
    ],
    floorPlans: [["2 BHK", 1050, 9900000], ["3 BHK", 1325, 12400000]],
  },
  {
    title: "Sky City Towers", developer: "Stalwart", category: "Apartment", status: "Under Construction", featured: true,
    price: 15000000, configurations: "3 & 4 BHK", area: "Patia", bedrooms: 3, bathrooms: 3, sqft: 1600, parking: 2,
    availableFrom: "March 2027", cover: "1486406146926-c627a92ad1ab",
    summary: "High-rise luxury living in Patia with skyline views, a rooftop infinity pool and world-class amenities.",
    description: [
      "Sky City Towers redefines urban living with a premium location minutes from Infocity and KIIT, superior design and world-class amenities.",
      "Every residence is designed for natural light and privacy, with a three-tier security system, sky lounge and a 40,000 sq.ft clubhouse.",
    ],
    features: {
      Interior: ["Gym", "Spa", "Mini Theatre"], Outdoor: ["Infinity Pool", "Sky Lounge", "Landscaped Gardens"],
      Utilities: ["Power Backup", "Piped Gas", "Rainwater Harvesting"], Other: ["High-speed Elevators", "Smart Home", "EV Charging"],
    },
    floorPlans: [["3 BHK", 1600, 15000000], ["4 BHK", 2150, 21000000]],
  },
  {
    title: "Avenue 07", developer: "Assotech", category: "Apartment", status: "Under Construction", featured: true,
    price: 16000000, configurations: "3 BHK", area: "Jaydev Vihar", bedrooms: 3, bathrooms: 2, sqft: 1800, parking: 1,
    availableFrom: "December 2027", cover: "1460317442991-0ec209397118",
    summary: "South Asian architecture meets tropical landscaping in a low-density community at the heart of the city.",
    description: [
      "Inspired by Bhubaneswar's climate, Avenue 07 is designed around South Asian architecture with deep verandahs, shaded courtyards and water features.",
      "Spacious 3 BHK residences with only four homes per floor give you privacy, light and calm in the city's most connected neighbourhood.",
    ],
    floorPlans: [["3 BHK", 1800, 16000000]],
  },
  {
    title: "Urbanyx Court", developer: "Urbanyx", category: "Apartment", status: "New Launch", featured: true,
    price: 13000000, configurations: "3 BHK", area: "Khandagiri", bedrooms: 3, bathrooms: 2, sqft: 1359, parking: 1,
    availableFrom: "June 2028", cover: "1574362848149-11496d93a7c7",
    summary: "A distinguished B+S+14 residential tower with refined interiors and a rooftop amenity deck.",
    description: [
      "Urbanyx Court is a distinguished luxury residential tower that redefines sophisticated urban living in the heart of Odisha.",
      "Large window walls, premium specifications and a rooftop amenity deck make it ideal for families who want space and convenience.",
    ],
    floorPlans: [["3 BHK", 1359, 13000000]],
  },
  {
    title: "Evos Amani", developer: "Evos Buildcon", category: "Apartment", status: "Under Construction",
    price: 10700000, configurations: "3 BHK", area: "Raghunathpur", bedrooms: 3, bathrooms: 2, sqft: 1766, parking: 1,
    availableFrom: "September 2027", cover: "1567496898669-ee935f5f647a",
    summary: "Three elegant towers of 3 BHK homes set amidst lush greenery, designed with a commitment to nature.",
    description: [
      "Evos Amani is a luxurious 3 BHK project featuring three elegant towers set amidst lush greenery.",
      "Over 70% open space, a tree-lined central boulevard and a sports arena create a resort-like environment close to the airport and NH-16.",
    ],
    floorPlans: [["3 BHK", 1766, 10700000]],
  },
  {
    title: "The Palms Villas", developer: "DN Homes", category: "Villa", status: "Ready to Move", featured: true,
    price: 32500000, configurations: "4 & 5 BHK", area: "Chandrasekharpur", bedrooms: 4, bathrooms: 5, sqft: 3850, parking: 2,
    availableFrom: "Immediate", cover: "1613490493576-7fde63acd811", extra: [img("1613977257363-707ba9348227")],
    summary: "Independent luxury villas with private gardens, a plunge pool and double-height living rooms.",
    description: [
      "The Palms is a gated enclave of only 24 independent villas, each with a private garden, plunge pool and double-height living room.",
      "Premium Italian marble, home automation and a dedicated clubhouse make it one of the most exclusive addresses in the city.",
    ],
    features: {
      Interior: ["Home Automation", "Italian Marble", "Modular Kitchen"], Outdoor: ["Private Garden", "Plunge Pool", "Clubhouse"],
      Utilities: ["Power Backup", "Solar Water Heater", "Water Supply"], Other: ["Gated Enclave", "24x7 Security", "Staff Quarters"],
    },
    floorPlans: [["4 BHK Villa", 3850, 32500000], ["5 BHK Villa", 4600, 41000000]],
  },
  {
    title: "Om Shivalik Duplex Homes", developer: "Om Shivalik", category: "Duplex", status: "New Launch",
    price: 14900000, configurations: "3 & 4 BHK", area: "Gothapatna", bedrooms: 4, bathrooms: 3, sqft: 2275, parking: 2,
    availableFrom: "January 2028", cover: "1600596542815-ffad4c1539a9", extra: [img("1600585154340-be6161a56a0c")],
    summary: "Spacious duplex homes with private terraces, blending modern living and elegant design.",
    description: [
      "Om Shivalik offers spacious 3 and 4 BHK duplex homes with private terraces and separate living and family lounges.",
      "Located off the ring road, it offers quick access to schools, hospitals and the upcoming metro corridor.",
    ],
    floorPlans: [["3 BHK Duplex", 1950, 14900000], ["4 BHK Duplex", 2275, 17800000]],
  },
  {
    title: "Assotech Pride", developer: "Assotech", category: "Apartment", listingType: "Rent", status: "Ready to Move",
    price: 38000, configurations: "3 BHK", area: "Rudrapur, NH-16", city: "Cuttack", bedrooms: 3, bathrooms: 2, sqft: 1550, parking: 1,
    availableFrom: "Immediate", cover: "1515263487990-61b07816b324",
    summary: "Semi-furnished 3 BHK on the Bhubaneswar-Cuttack expressway with clubhouse access, available for rent.",
    description: [
      "An upscale residential project right on the NH-16 six-lane expressway, offering easy commutes to both Bhubaneswar and Cuttack.",
      "This semi-furnished 3 BHK comes with wardrobes, a modular kitchen and full access to the clubhouse and pool.",
    ],
    floorPlans: [["3 BHK", 1550, 38000]],
  },
  {
    title: "Green Meadows Plots", developer: "GLS Group", category: "Plot", status: "Ready to Move",
    price: 3600000, configurations: "1,200 - 2,400 ft² plots", area: "Janla", bedrooms: 0, bathrooms: 0, sqft: 1200, parking: 0,
    availableFrom: "Immediate", cover: "1500382017468-9049fed747ef", extra: [img("1628624747186-a941c476b7ef")],
    summary: "BDA-approved residential plots with wide internal roads, ready for registration and construction.",
    description: [
      "Green Meadows is a BDA-approved plotted development with 40 ft internal roads, underground drainage and street lighting.",
      "Ideal for building your own home or as a long-term investment along the fast-developing Janla corridor.",
    ],
    features: {
      Interior: [], Outdoor: ["40 ft Roads", "Park", "Avenue Plantation"],
      Utilities: ["Electricity", "Underground Drainage", "Water Supply"], Other: ["BDA Approved", "Clear Title", "Gated Layout"],
    },
    floorPlans: [["1,200 ft² plot", 1200, 3600000], ["2,400 ft² plot", 2400, 7000000]],
  },
  {
    title: "Lakeview Heights", developer: "Utkal Builders", category: "Apartment", status: "Ready to Move",
    price: 7800000, configurations: "2 BHK", area: "Nayapalli", bedrooms: 2, bathrooms: 2, sqft: 1120, parking: 1,
    availableFrom: "Immediate", cover: "1512917774080-9991f1c4c750",
    summary: "Compact, well-planned 2 BHK homes overlooking a landscaped lake, in the heart of Nayapalli.",
    description: [
      "Lakeview Heights offers efficient 2 BHK homes with lake-facing balconies and plenty of natural light.",
      "Walking distance to Kalinga Hospital, top schools and shopping, it's a perfect first home or investment.",
    ],
    floorPlans: [["2 BHK", 1120, 7800000]],
  },
  {
    title: "Royal Orchid Villas", developer: "Mayfair Developers", category: "Villa", status: "Under Construction",
    price: 24500000, configurations: "4 BHK", area: "Tamando", bedrooms: 4, bathrooms: 4, sqft: 3200, parking: 2,
    availableFrom: "August 2027", cover: "1580587771525-78b9dba3b914", extra: [img("1564013799919-ab600027ffc6")],
    summary: "Contemporary 4 BHK villas with landscaped lawns, a private deck and a members-only clubhouse.",
    description: [
      "Royal Orchid is a boutique community of 40 contemporary villas near AIIMS and the Tamando growth corridor.",
      "Each villa features a private lawn, a sun deck, a home office and a dedicated staff room.",
    ],
    features: {
      Interior: ["Home Office", "Modular Kitchen", "Wooden Flooring"], Outdoor: ["Private Lawn", "Sun Deck", "Clubhouse"],
      Utilities: ["Power Backup", "Solar Panels", "Water Supply"], Other: ["Gated Community", "24x7 Security", "EV Charging"],
    },
    floorPlans: [["4 BHK Villa", 3200, 24500000]],
  },
  {
    title: "Infocity Business Hub", developer: "Stalwart", category: "Commercial", status: "Ready to Move",
    price: 8500000, configurations: "Office spaces 800 - 5,000 ft²", area: "Infocity, Patia", bedrooms: 0, bathrooms: 2, sqft: 1000, parking: 2,
    availableFrom: "Immediate", cover: "1497366216548-37526070297c", extra: [img("1497366811353-6870744d04b2"), img("1554469384-e58fac16e23a")],
    summary: "Grade-A office spaces next to Infocity with plug-and-play options and ample parking.",
    description: [
      "Infocity Business Hub offers Grade-A office spaces with a double-height lobby, high-speed elevators and 100% power backup.",
      "Choose from bare-shell or plug-and-play floor plates, ideal for IT companies, start-ups and professional firms.",
    ],
    features: {
      Interior: ["Central AC", "Conference Rooms", "Food Court"], Outdoor: ["Multi-level Parking", "Landscaped Plaza"],
      Utilities: ["100% Power Backup", "High-speed Internet", "Fire Safety"], Other: ["Access Control", "24x7 Security", "Visitor Management"],
    },
    floorPlans: [["Office 1,000 ft²", 1000, 8500000], ["Office 2,500 ft²", 2500, 20500000]],
  },
  {
    title: "Serene Greens Apartment", developer: "GLS Group", category: "Apartment", listingType: "Rent", status: "Ready to Move",
    price: 22000, configurations: "2 BHK", area: "Saheed Nagar", bedrooms: 2, bathrooms: 2, sqft: 1050, parking: 1,
    availableFrom: "November 2026", cover: "1568605114967-8130f3a36994",
    summary: "Fully furnished 2 BHK for rent in Saheed Nagar, close to Esplanade mall and the railway station.",
    description: [
      "A fully furnished 2 BHK with air conditioning, a modular kitchen, washing machine and refrigerator, ready to move in.",
      "Located in Saheed Nagar with quick access to Esplanade One, Master Canteen and the railway station.",
    ],
    floorPlans: [["2 BHK", 1050, 22000]],
  },
  {
    title: "Riverfront Signature", developer: "Tata Housing", category: "Apartment", status: "New Launch", featured: true,
    price: 19500000, configurations: "3 & 4 BHK", area: "Cuttack Road", city: "Cuttack", bedrooms: 4, bathrooms: 4, sqft: 2400, parking: 2,
    availableFrom: "March 2029", cover: "1582407947304-fd86f028f716",
    summary: "Premium riverfront residences with panoramic views of the Mahanadi and a 2-acre central park.",
    description: [
      "Riverfront Signature is a landmark launch on the banks of the Mahanadi, offering panoramic river views from every home.",
      "A 2-acre central park, a riverside promenade and a 50,000 sq.ft clubhouse make it one of the most anticipated projects in Odisha.",
    ],
    floorPlans: [["3 BHK", 1950, 19500000], ["4 BHK", 2400, 24000000]],
  },
  {
    title: "Heritage Row Duplex", developer: "DN Homes", category: "Duplex", listingType: "Rent", status: "Ready to Move",
    price: 55000, configurations: "4 BHK", area: "Jagamara", bedrooms: 4, bathrooms: 4, sqft: 2600, parking: 2,
    availableFrom: "Immediate", cover: "1600047509807-ba8f99d2cdde",
    summary: "Spacious 4 BHK duplex for rent with a private terrace garden, ideal for large families.",
    description: [
      "A beautifully maintained 4 BHK duplex with a private terrace garden, two living areas and a dedicated puja room.",
      "Set in a quiet gated row-house community near Khandagiri with easy access to schools and hospitals.",
    ],
    floorPlans: [["4 BHK Duplex", 2600, 55000]],
  },
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const now = Date.now();

const properties = seeds.map((s, i) => ({
  ref: 22543 + i,
  slug: slugify(s.title),
  title: s.title,
  developer: s.developer,
  category: s.category,
  listingType: s.listingType ?? "Sale",
  status: s.status,
  placements: !s.featured ? [] : i === 0 ? ["spotlight", "homeFeatured", "footer", "pinned"] : ["homeFeatured", "footer"],
  published: true,
  price: String(s.price),
  units: null,
  configurations: s.configurations,
  area: s.area,
  city: s.city ?? "Bhubaneswar",
  state: "Odisha",
  bedrooms: s.bedrooms,
  bathrooms: s.bathrooms,
  sqft: s.sqft,
  parking: s.parking,
  availableFrom: s.availableFrom,
  rera: `RP/19/${2021 + (i % 5)}/${String(300 + i * 71).padStart(5, "0")}`,
  summary: s.summary,
  description: s.description,
  images: [img(s.cover), ...(s.extra ?? []), ...pick(i, s.category === "Plot" ? 0 : s.category === "Commercial" ? 1 : 4)],
  features: s.features ?? apartmentFeatures,
  floorPlans: s.floorPlans.map(([name, sqft, price]) => ({ name, sqft, price })),
  createdAt: new Date(now - i * 86400000),
  updatedAt: new Date(now - i * 86400000),
}));

const posts = [
  {
    title: "First-time home buyer's checklist for Bhubaneswar",
    category: "Buying guide",
    cover: "1560518883-ce09059eeffa",
    excerpt: "Everything you should verify before booking your first home, from RERA registration to hidden costs.",
    content: `Buying your first home is exciting, but it is also one of the biggest financial decisions you will make. Here is the checklist our advisors walk every first-time buyer through.

## 1. Check RERA registration
Every project above 500 sq.m or eight units must be registered with ORERA. Look up the RERA number on the ORERA portal and confirm the approved plan, promoter details and possession timeline.

## 2. Verify the title and approvals
Ask for the land title, BDA/BMC plan approval and environmental clearance. Our in-house legal team checks these documents for you at no extra cost.

## 3. Understand the total cost
The base price is only part of the story. Add GST (for under-construction homes), stamp duty and registration, maintenance deposit, parking and club membership.

## 4. Visit at different times
Visit the site in the morning and in the evening to understand traffic, noise and light. Talk to people who already live nearby.

## 5. Get your loan pre-approved
A pre-approved home loan gives you negotiating power and avoids last-minute surprises.`,
  },
  {
    title: "Ready-to-move vs under-construction: which is right for you?",
    category: "Buying guide",
    cover: "1503387762-592deb58ef4e",
    excerpt: "We compare price, risk, tax and timelines so you can pick the option that fits your plans.",
    content: `One of the first decisions every buyer faces is whether to buy a ready-to-move home or book in an under-construction project.

## Ready-to-move homes
You see exactly what you are buying, there is no GST, and you can move in or start earning rent immediately. The trade-off is a higher price and fewer unit choices.

## Under-construction homes
Prices are typically 10-20% lower, payment plans are flexible and you get the best choice of floors and views. The risks are delays and changes to the final product, which is why choosing a reputed developer and a RERA-registered project matters.

## Our advice
If you need a home within a year, go ready-to-move. If you are investing for the long term and can wait, a well-chosen under-construction project from a reliable developer can deliver strong appreciation.`,
  },
  {
    title: "Top 5 upcoming neighbourhoods in Bhubaneswar for 2027",
    category: "Market insights",
    cover: "1449844908441-8829872d2607",
    excerpt: "Patia, Kalinga Nagar, Tamando and more: where infrastructure is driving real estate growth.",
    content: `Bhubaneswar continues to be one of the fastest growing tier-2 cities in India. These five neighbourhoods stand out for investors and home buyers.

## Patia and Infocity
The IT corridor keeps attracting professionals, and premium high-rises here see strong rental demand.

## Kalinga Nagar
Large townships, wide roads and plenty of green space make it a favourite for families.

## Tamando
Proximity to AIIMS and the proposed ring road has made Tamando a hot spot for villas and plotted developments.

## Raghunathpur
Close to the airport and NH-16, with several new launches from reputed developers.

## Janla
Affordable plotted developments with excellent long-term appreciation potential.`,
  },
  {
    title: "How to get the best home loan rate in 2026",
    category: "Finance",
    cover: "1554224155-6726b3ff858f",
    excerpt: "Simple steps to improve your eligibility and save lakhs over the life of your loan.",
    content: `A small difference in interest rate can save you lakhs over a 20-year loan. Here is how to get the best deal.

## Improve your credit score
Aim for 750 or above. Pay all EMIs and credit card bills on time and avoid multiple loan applications in a short period.

## Compare more than three lenders
Rates, processing fees and prepayment terms vary widely. Our loan desk compares offers from leading banks for you.

## Consider a co-applicant
Adding an earning spouse or parent increases eligibility and can unlock tax benefits for both of you.

## Choose the right tenure
A longer tenure lowers your EMI, but increases total interest. Prepay whenever you can.`,
  },
  {
    title: "NRI guide to buying property in Odisha",
    category: "NRI",
    cover: "1450101499163-c8848c66ca85",
    excerpt: "Documentation, payments, power of attorney and tax rules explained for NRIs.",
    content: `NRIs can buy residential and commercial property in India without RBI approval. Here is what you need to know.

## Documents
You will need your passport, OCI/PIO card if applicable, PAN card and overseas address proof.

## Payments
Payments must be made through NRE, NRO or FCNR accounts, or through normal banking channels.

## Power of attorney
If you cannot travel, you can appoint a trusted person in India through a registered power of attorney to complete the registration.

## How we help
Our NRI desk offers video site visits, document verification and end-to-end coordination so you can buy with confidence from anywhere in the world.`,
  },
  {
    title: "Vastu tips for your new apartment",
    category: "Lifestyle",
    cover: "1600566753086-00f18fb6b3ea",
    excerpt: "Simple, practical Vastu guidelines for entrances, kitchens and bedrooms in modern apartments.",
    content: `Many buyers in Odisha consider Vastu when choosing a home. Here are simple guidelines that work for modern apartments.

## Entrance
East or north facing entrances are traditionally considered auspicious. Keep the entrance well lit and clutter free.

## Kitchen
The south-east corner is ideal for the kitchen, with the cook facing east.

## Master bedroom
The south-west corner is preferred for the master bedroom, bringing stability and good sleep.

## Balance over perfection
Few apartments are perfectly Vastu-compliant. Focus on light, ventilation and a layout that suits your family.`,
  },
].map((p, i) => ({
  slug: slugify(p.title),
  title: p.title,
  excerpt: p.excerpt,
  coverImage: img(p.cover),
  content: p.content,
  author: "Prolific Properties Team",
  category: p.category,
  published: true,
  publishedAt: new Date(now - i * 5 * 86400000),
  updatedAt: new Date(now - i * 5 * 86400000),
}));

const settings = {
  _id: "site",
  siteName: "Prolific Properties",
  tagline: "Homes worth living for",
  description:
    "Explore verified homes across Bhubaneswar and Odisha with clear information and local guidance from Prolific Properties.",
  phone: "9090090155",
  whatsapp: "919090090155",
  email: "info@prolificproperties.in",
  hrEmail: "hr@prolificproperties.in",
  address: "Saheed Nagar, Bhubaneswar, Odisha",
  hours: "Mon - Sat, 9:30 AM - 7:00 PM",
  rera: "ORERA - ORA/0333/2026",
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    youtube: "https://youtube.com/",
  },
  hero: {
    title: "Find your perfect property in",
    highlight: "Bhubaneswar.",
    subtitle: "Explore verified homes, compare your options, and get guidance from a local property advisor.",
  },
  stats: [
    { value: "12+", label: "Years of experience" },
    { value: "1,000+", label: "Happy families" },
    { value: "40+", label: "Partner developers" },
    { value: "25+", label: "Expert advisors" },
  ],
  developers: ["Tata Housing", "Assotech", "Stalwart", "DN Homes", "Evos Buildcon", "Urbanyx", "Om Shivalik", "GLS Group"],
  founder: {
    name: "Founder & Director",
    title: "Prolific Properties",
    message:
      "Our journey began with a vision to provide the best home-buying solutions to our customers. Since our inception we have been unwavering in our commitment to transparency, efficiency and professionalism. Our success isn't about numbers. It's about the trust our clients, partners and employees place in us.",
  },
};

const testimonials = [
  ["Bighneswar Pani", "Retired Government Officer", "The team was professional and patient through every part of the purchase. They explained each document and made the whole process feel effortless."],
  ["Dr. Bishnu Prasad Panigrahi", "Healthcare Executive", "I was working out of state and needed to sell my flat. Prolific found a buyer at a great price and handled the registration seamlessly."],
  ["Bikram Mohanty", "Home Owner", "From the first site visit to getting the keys, everything was smooth and stress-free. Highly recommended if you want a hassle-free experience."],
  ["Sneha Patnaik", "Software Engineer, Infocity", "As an NRI returning home, I bought my apartment entirely over video calls. The documentation support was outstanding."],
].map(([name, role, text], order) => ({ name, role, text, order }));

const jobs = [
  { title: "Pre Sales Executive", type: "Full-time", location: "Bhubaneswar", open: true, text: "Qualify leads, schedule site visits and keep buyers informed through the early stages of their journey." },
  { title: "Relationship Manager", type: "Full-time", location: "Bhubaneswar", open: true, text: "Own client relationships end to end, from site visits and negotiation to booking and documentation." },
  { title: "Digital Marketing Executive", type: "Full-time", location: "Bhubaneswar", open: true, text: "Plan and run campaigns across Google, Meta and property portals to generate quality leads." },
];

const client = await new MongoClient(MONGODB_URI).connect();
const db = client.db("prolific_properties");

for (const [name, docs] of Object.entries({ properties, posts, testimonials, jobs })) {
  await db.collection(name).deleteMany({});
  await db.collection(name).insertMany(docs as never[]);
}
await db.collection("settings").replaceOne({ _id: "site" as never }, settings, { upsert: true });

await db.collection("properties").createIndex({ slug: 1 }, { unique: true });
await db.collection("posts").createIndex({ slug: 1 }, { unique: true });
await db.collection("admins").createIndex({ email: 1 }, { unique: true });
await db.collection("enquiries").createIndex({ createdAt: -1 });

const email = ADMIN_EMAIL.toLowerCase();
if (!(await db.collection("admins").findOne({ email }))) {
  await db.collection("admins").insertOne({ email, name: "Admin", passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12), createdAt: new Date() });
  console.log(`Created admin ${email}`);
}

console.log(`Seeded ${properties.length} properties, ${posts.length} posts, ${testimonials.length} testimonials, ${jobs.length} jobs and site settings.`);
await client.close();
