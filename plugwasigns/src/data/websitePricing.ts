export interface WebPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  priceDisplay: string;
  idealFor: string;
  popular?: boolean;
  recommended?: boolean;
  color: string; // Tailwind color token or hex
  accentBorder: string;
  features: string[];
  revisions: string;
}

export const WEBSITE_PACKAGES: WebPackage[] = [
  {
    id: "starter",
    name: "Starter / Landing Page",
    tagline: "Simple. Clean. Effective.",
    price: 25000,
    priceDisplay: "25,000",
    idealFor: "Individuals, small businesses, projects, and personal brands.",
    color: "#0ea5e9", // Sky blue
    accentBorder: "border-sky-500/40 hover:border-sky-400",
    features: [
      "1-page high-converting responsive website",
      "Modern UI/UX design tailored to your niche",
      "Mobile & desktop speed optimized",
      "Direct WhatsApp chat integration & contact form",
      "Interactive Google Maps location integration",
      "Social media links & basic SEO structure",
      "SSL certificate setup & security"
    ],
    revisions: "1 Revision included"
  },
  {
    id: "business",
    name: "Business Website",
    tagline: "Build trust. Grow your brand.",
    price: 40000,
    priceDisplay: "40,000",
    idealFor: "Small & growing businesses, service providers, and organizations.",
    popular: true,
    color: "#10b981", // Emerald green
    accentBorder: "border-emerald-500/40 hover:border-emerald-400",
    features: [
      "Up to 5 pages (Home, About, Services, Contact + 1 extra)",
      "Custom responsive design & branding palette",
      "WhatsApp integration, lead contact form & Google Maps",
      "Social media integration & comprehensive on-page SEO",
      "Google Analytics & Google Search Console setup",
      "SSL security certificate & speed optimization"
    ],
    revisions: "2 Revisions included"
  },
  {
    id: "professional",
    name: "Professional Business Website",
    tagline: "More features. More growth.",
    price: 60000,
    priceDisplay: "60,000",
    idealFor: "Established businesses, corporate brands, and expanding companies.",
    recommended: true,
    color: "#8b5cf6", // Violet / purple
    accentBorder: "border-violet-500/40 hover:border-violet-400",
    features: [
      "Up to 8–10 custom pages",
      "Tailored UI/UX design with advanced animations & interactions",
      "Blog / News section or Content Management System (CMS)",
      "Advanced SEO strategy, Google Analytics & Search Console",
      "WhatsApp quick-actions, Google Maps & social integrations",
      "High performance optimization & robust SSL security",
      "Basic post-launch support & handoff guide"
    ],
    revisions: "3 Revisions + Post-Launch Support"
  },
  {
    id: "ecommerce",
    name: "E-Commerce Website",
    tagline: "Sell online. Reach more customers.",
    price: 90000,
    priceDisplay: "90,000",
    idealFor: "Online stores, retailers, boutiques, and product-based businesses.",
    color: "#f97316", // Warm Orange
    accentBorder: "border-orange-500/40 hover:border-orange-400",
    features: [
      "Full online store: product catalogue, cart & secure checkout",
      "M-Pesa integration & card payment gateways (where required)",
      "Order management system & customer accounts",
      "WhatsApp direct ordering integration & order alerts",
      "Admin dashboard with product management & upload",
      "Google Analytics, basic SEO & store metrics tracking",
      "Complete hands-on training on how to manage your store"
    ],
    revisions: "Comprehensive Setup & Training"
  },
  {
    id: "custom-app",
    name: "Custom Web Application",
    tagline: "Your idea. Our code.",
    price: 150000,
    priceDisplay: "150,000",
    idealFor: "Unique business needs, SaaS platforms, custom dashboards, portals & internal tools.",
    color: "#a855f7", // Vibrant purple
    accentBorder: "border-purple-500/40 hover:border-purple-400",
    features: [
      "In-depth requirements analysis & technical architecture",
      "Bespoke UI/UX design built for speed & scale",
      "Secure user authentication & cloud database architecture",
      "Third-party API integrations & custom payment gateways",
      "Automated business workflows & deployment pipelines",
      "Full technical documentation & launch testing"
    ],
    revisions: "Custom milestone-based revisions"
  },
  {
    id: "redesign",
    name: "Website Redesign",
    tagline: "Modern look. Better results.",
    price: 30000,
    priceDisplay: "30,000",
    idealFor: "Businesses looking to revamp, modernize, or speed up their existing website.",
    color: "#06b6d4", // Cyan
    accentBorder: "border-cyan-500/40 hover:border-cyan-400",
    features: [
      "Fresh, ultra-modern aesthetic aligning with current design standards",
      "Drastic performance & loading speed improvements",
      "Complete mobile-first responsiveness overhaul",
      "Modern SEO structure to regain & boost Google rankings",
      "Content migration & link structure preservation"
    ],
    revisions: "2 Revisions included"
  }
];

export interface AddonService {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  unit?: string;
  note?: string;
}

export const ADDON_SERVICES: AddonService[] = [
  { id: "extra_page", name: "Additional Page", price: 2000, priceDisplay: "2,000", unit: "per page" },
  { id: "copywriting", name: "Professional Copywriting", price: 3000, priceDisplay: "From 3,000", unit: "per page" },
  { id: "branding", name: "Logo / Basic Branding", price: 3000, priceDisplay: "From 3,000" },
  { id: "domain", name: "Domain Registration (.co.ke / .com)", price: 0, priceDisplay: "At cost" },
  { id: "hosting", name: "High-Speed Cloud Hosting", price: 5000, priceDisplay: "From 5,000", unit: "per year" },
  { id: "maintenance", name: "Website Maintenance & Backups", price: 3000, priceDisplay: "3,000 – 10,000", unit: "per month" },
  { id: "seo_monthly", name: "SEO Growth Package", price: 10000, priceDisplay: "From 10,000", unit: "per month" },
  { id: "mpesa", name: "M-Pesa Automated Payment Integration", price: 10000, priceDisplay: "From 10,000" },
  { id: "booking", name: "Online Booking / Appointment System", price: 10000, priceDisplay: "From 10,000" },
  { id: "cms_blog", name: "Blog / CMS Setup", price: 5000, priceDisplay: "From 5,000" },
  { id: "extra_revision", name: "Extra Revision Cycle", price: 1500, priceDisplay: "1,500" },
];

export const WHY_WORK_WITH_US = [
  {
    title: "Modern Technologies",
    description: "Built with React, Vite, Supabase, and trusted tools for blistering speed, security, and effortless scalability.",
    icon: "Rocket"
  },
  {
    title: "Custom Tailored Designs",
    description: "Clean, bespoke designs crafted to highlight your brand's unique identity, rather than cookie-cutter templates.",
    icon: "Palette"
  },
  {
    title: "100% Mobile Friendly",
    description: "Flawless experience across all screens — smartphones, tablets, laptops, and ultra-wide desktop monitors.",
    icon: "Smartphone"
  },
  {
    title: "Google SEO Optimized",
    description: "Engineered from code level so your local Kenyan clients can find you on Google Search and Google Maps.",
    icon: "Search"
  },
  {
    title: "Secure & Reliable",
    description: "Free SSL certificates, standard cybersecurity practices, and robust clean code that never slows you down.",
    icon: "ShieldCheck"
  },
  {
    title: "On-Time Delivery",
    description: "We respect your business timeline. Fast turnaround times delivered exactly as scheduled.",
    icon: "Clock"
  },
  {
    title: "Ongoing Support",
    description: "We don't disappear after launching. We remain available for updates, troubleshooting, and advice.",
    icon: "Headphones"
  },
  {
    title: "Affordable & Fair Pricing",
    description: "Top-tier digital engineering at competitive, transparent Kenyan market rates — no hidden surprises.",
    icon: "Award"
  }
];
