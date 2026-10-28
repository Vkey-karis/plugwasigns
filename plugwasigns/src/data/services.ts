import { 
  PenTool, Box, Stamp, Layout, Car, Lightbulb, BookOpen, Flag, Shirt, 
  Fence, Wallpaper, BookMarked, Coffee, Store, Layers, type LucideIcon 
} from "lucide-react";
import type { PortfolioItem } from "./portfolio";
import { DEFAULT_CATEGORY_IMAGES } from "./portfolio";

export interface CategoryMetadata {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  applications: string[];
  materials: string[];
}

export const CATEGORY_METADATA_MAP: Record<string, CategoryMetadata> = {
  "2D": {
    id: "2d-signage",
    title: "2D Signage",
    shortDescription: "PVC signs, flat signs, directional and printed boards.",
    description: "High-quality flat signs perfect for informational displays, directional signs, and storefront branding. We use durable materials for both indoor and outdoor use.",
    icon: Layout,
    applications: ["Office signs", "Directional signs", "Menu boards", "Wall signs"],
    materials: ["PVC", "Aluminium Board", "Forex", "Vinyl"]
  },
  "3D": {
    id: "3d-signage",
    title: "3D Signage",
    shortDescription: "3D letters, acrylic letters, and raised architectural signs.",
    description: "Give your brand physical depth. We create custom 3D letters and raised signage designed for storefronts, reception areas, offices and commercial spaces.",
    icon: Box,
    applications: ["Reception signs", "Storefronts", "Building exteriors", "Logo walls"],
    materials: ["Acrylic", "Stainless Steel", "Aluminium", "Foam"]
  },
  "STICKERS": {
    id: "stickers",
    title: "Stickers & Labels",
    shortDescription: "Product labels, window decals, and die-cut promotional stickers.",
    description: "Custom printed and cut stickers for products, windows, and promotions. Available in any shape and size with gloss, matte, or clear finish.",
    icon: Stamp,
    applications: ["Product labels", "Window decals", "Promotional giveaways", "Floor graphics"],
    materials: ["Gloss Vinyl", "Matte Vinyl", "Clear Vinyl", "Reflective"]
  },
  "BRANDING": {
    id: "branding",
    title: "Branding & Spaces",
    shortDescription: "Business branding, wall graphics, and corporate interiors.",
    description: "Complete visual identity applications for your physical spaces. From blank walls to fully branded office environments and event venues.",
    icon: PenTool,
    applications: ["Office branding", "Shop interiors", "Corporate spaces", "Event stands"],
    materials: ["Printed Wallpaper", "Vinyl", "Fabric", "Decals"]
  },
  "VEHICLE": {
    id: "vehicle-branding",
    title: "Vehicle Branding",
    shortDescription: "Car wraps, van branding, and mobile fleet graphics.",
    description: "Turn your vehicles into moving billboards that work 24/7. We design and install high-quality vehicle wraps, partial wraps, and door graphics.",
    icon: Car,
    applications: ["Full wraps", "Partial wraps", "Door decals", "Fleet branding"],
    materials: ["Cast Vinyl", "Perforated Window Film", "Reflective Vinyl"]
  },
  "LED": {
    id: "led-signage",
    title: "LED & Illuminated Signs",
    shortDescription: "Light boxes, backlit letters, and radiant illuminated signs.",
    description: "Make sure your business is seen day and night. We create striking illuminated signs, 3D backlit letters, and neon-style lightboxes.",
    icon: Lightbulb,
    applications: ["Shop fronts", "Nightclubs/Bars", "Restaurants", "Billboards"],
    materials: ["LED Modules", "Translucent Acrylic", "Flex Face", "Aluminium Profile"]
  },
  "SHOP SIGNS": {
    id: "shop-signs",
    title: "Shop & Storefront Signs",
    shortDescription: "Storefront fascias, entrance boards, and street branding.",
    description: "Capture foot traffic and build local brand authority with bold storefront fascia signs, entrance branding, and street-level advertising.",
    icon: Store,
    applications: ["Storefronts", "Plaza shops", "Supermarkets", "Salons & Spas"],
    materials: ["Alucobond", "Backlit Acrylic", "Steel Framing", "3D Letters"]
  },
  "APPAREL": {
    id: "apparel-branding",
    title: "Apparel Branding",
    shortDescription: "Custom t-shirts, hoodies, uniforms, and corporate wear.",
    description: "Turn your team and customers into brand ambassadors with high-quality custom apparel. Screen printing, embroidery, and heat transfer.",
    icon: Shirt,
    applications: ["Corporate uniforms", "Event t-shirts", "Safety wear (PPE)", "Promotional caps"],
    materials: ["Cotton", "Polyester Blends", "Embroidery Thread", "Heat Transfer Vinyl"]
  },
  "PRINT": {
    id: "print",
    title: "Print & Stationery",
    shortDescription: "Receipt books, eulogies, invoice pads, mugs, and promotional prints.",
    description: "Professional printing services including carbonless receipt books, tribute memorial programs, branded mugs, flyers, and business cards.",
    icon: BookOpen,
    applications: ["Receipt & invoice pads", "Funeral programs", "Branded mugs", "Flyers & brochures"],
    materials: ["NCR Carbonless Paper", "Gloss Art Paper", "Cardstock", "Ceramic"]
  },
  "DECOR": {
    id: "wallpapers",
    title: "Wall Murals & Decor",
    shortDescription: "Custom printed wall murals and decorative wallpapers.",
    description: "Transform interior atmospheres with custom-printed wall murals, artistic wallpapers, and large-format wall graphics for offices, hotels, and homes.",
    icon: Wallpaper,
    applications: ["Office feature walls", "Restaurant decor", "Hotel lobbies", "Retail interiors"],
    materials: ["Non-woven Wallpaper", "Self-adhesive Vinyl", "Fabric Wall Covering", "UV Board"]
  },
  "BANNERS": {
    id: "teardrop-banners",
    title: "Teardrop Banners & Flags",
    shortDescription: "Teardrop flags, roll-up banners, and high-impact event displays.",
    description: "Maximize outdoor and event visibility with heavy-duty teardrop banners, telescopic flags, roll-up banners, and perimeter fence graphics.",
    icon: Flag,
    applications: ["Corporate events", "Storefront promotions", "Trade expos", "Sports grounds"],
    materials: ["Polyester Fabric", "Fiberglass Poles", "Cross Base", "Ground Spike"]
  }
};

export interface CategoryServiceItem {
  id: string;
  category: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  image: string;
  itemCount: number;
  applications: string[];
  materials: string[];
}

export function formatCategoryTitle(category: string): string {
  if (CATEGORY_METADATA_MAP[category]?.title) {
    return CATEGORY_METADATA_MAP[category].title;
  }
  // Convert "ACRYLIC SIGNS" -> "Acrylic Signs"
  return category
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getCategoryImage(
  category: string,
  categoryImages?: Record<string, string>,
  portfolioItems?: PortfolioItem[]
): string {
  const cat = category.toUpperCase();
  // 1. Explicit user selection
  if (categoryImages && categoryImages[cat]) {
    return categoryImages[cat];
  }
  // 2. Default predefined category image
  if (DEFAULT_CATEGORY_IMAGES[cat]) {
    return DEFAULT_CATEGORY_IMAGES[cat];
  }
  // 3. First hero or featured item in this category
  if (portfolioItems && portfolioItems.length > 0) {
    const featuredItem = portfolioItems.find(
      i => i.category.toUpperCase() === cat && (i.isHero || i.isFeatured)
    );
    if (featuredItem?.image) return featuredItem.image;

    // 4. Any item in this category
    const anyItem = portfolioItems.find(i => i.category.toUpperCase() === cat);
    if (anyItem?.image) return anyItem.image;
  }
  // 5. Fallback
  return "/work/dazzle-3d.jpg";
}

export function getCategoryServices(
  categories: string[],
  categoryImages?: Record<string, string>,
  portfolioItems?: PortfolioItem[]
): CategoryServiceItem[] {
  const items = portfolioItems || [];

  return categories.map(cat => {
    const upperCat = cat.toUpperCase();
    const meta = CATEGORY_METADATA_MAP[upperCat];
    const image = getCategoryImage(upperCat, categoryImages, items);
    const count = items.filter(i => i.category.toUpperCase() === upperCat).length;
    const slug = meta?.id || upperCat.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (meta) {
      return {
        id: slug,
        category: upperCat,
        title: meta.title,
        shortDescription: meta.shortDescription,
        description: meta.description,
        icon: meta.icon,
        image,
        itemCount: count,
        applications: meta.applications,
        materials: meta.materials
      };
    }

    // Dynamic newly added category
    const title = formatCategoryTitle(upperCat);
    return {
      id: slug,
      category: upperCat,
      title,
      shortDescription: `Custom professional ${title.toLowerCase()} tailored for your business.`,
      description: `High-quality ${title.toLowerCase()} design, precision fabrication, and professional installation by PlugWaSigns.`,
      icon: Layers,
      image,
      itemCount: count,
      applications: ["Commercial spaces", "Storefronts", "Events", "Custom orders"],
      materials: ["Custom fabrication", "Durable materials", "Weatherproof finish"]
    };
  });
}

// Retain legacy SERVICES array for backwards compatibility
export const SERVICES = [
  {
    id: "2d-signage",
    title: "2D Signage",
    shortDescription: "PVC signs, flat signs, and printed boards.",
    description: "High-quality flat signs perfect for informational displays, directional signs, and storefront branding. We use durable materials for both indoor and outdoor use.",
    icon: Layout,
    applications: ["Office signs", "Directional signs", "Menu boards", "Wall signs"],
    materials: ["PVC", "Aluminium Board", "Forex", "Vinyl"],
    image: "/work/gentry-spa.jpg"
  },
  {
    id: "3d-signage",
    title: "3D Signage",
    shortDescription: "3D letters, acrylic letters, and raised signage.",
    description: "Give your brand physical depth. We create custom 3D letters and raised signage designed for storefronts, reception areas, offices and commercial spaces.",
    icon: Box,
    applications: ["Reception signs", "Storefronts", "Building exteriors", "Logo walls"],
    materials: ["Acrylic", "Stainless Steel", "Aluminium", "Foam"],
    image: "/work/dazzle-3d.jpg"
  },
  {
    id: "branding",
    title: "Branding",
    shortDescription: "Business branding, wall branding, and office branding.",
    description: "Complete visual identity applications for your physical spaces. From blank walls to fully branded environments.",
    icon: PenTool,
    applications: ["Office branding", "Shop interiors", "Corporate spaces", "Event stands"],
    materials: ["Printed Wallpaper", "Vinyl", "Fabric", "Decals"],
    image: "/work/raffine-board.png"
  },
  {
    id: "stickers",
    title: "Stickers",
    shortDescription: "Product, vehicle, and promotional stickers.",
    description: "Custom printed and cut stickers for products, windows, and promotions. Available in any shape and size.",
    icon: Stamp,
    applications: ["Product labels", "Window decals", "Promotional giveaways", "Floor graphics"],
    materials: ["Gloss Vinyl", "Matte Vinyl", "Clear Vinyl", "Reflective"],
    image: "/work/reflective-exit-signs.png"
  },
  {
    id: "vehicle-branding",
    title: "Vehicle Branding",
    shortDescription: "Car wraps, van branding, and fleet graphics.",
    description: "Turn your vehicles into moving billboards. We design and install high-quality vehicle wraps and decals.",
    icon: Car,
    applications: ["Full wraps", "Partial wraps", "Door decals", "Fleet branding"],
    materials: ["Cast Vinyl", "Perforated Window Film", "Reflective Vinyl"],
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80"
  },
  {
    id: "led-signage",
    title: "LED & Illuminated Signs",
    shortDescription: "Light boxes, LED signs, and backlit letters.",
    description: "Make sure your business is seen day and night. We create striking illuminated signs and lightboxes.",
    icon: Lightbulb,
    applications: ["Shop fronts", "Nightclubs/Bars", "Restaurants", "Billboards"],
    materials: ["LED Modules", "Translucent Acrylic", "Flex Face", "Aluminium Profile"],
    image: "/work/neon-cocktail.jpg"
  },
  {
    id: "eulogy-printing",
    title: "Eulogies & Memorials",
    shortDescription: "High-quality printed eulogies and funeral programs.",
    description: "Honor your loved ones with beautifully designed and professionally printed eulogies, funeral programs, and memorial booklets.",
    icon: BookOpen,
    applications: ["Funeral programs", "Memorial booklets", "Tribute cards", "Condolence books"],
    materials: ["Premium Cardstock", "Glossy Paper", "Matte Finish", "Textured Paper"],
    image: "/work/eulogy-program.png"
  },
  {
    id: "teardrop-banners",
    title: "Teardrop Banners",
    shortDescription: "Eye-catching outdoor teardrop and feather banners.",
    description: "Maximize your outdoor visibility with custom-printed teardrop and feather banners. Perfect for events, storefronts, and promotions.",
    icon: Flag,
    applications: ["Corporate events", "Storefront advertising", "Trade shows", "Sports events"],
    materials: ["Polyester Fabric", "Fiberglass Poles", "Cross Base", "Ground Spike"],
    image: "/work/teardrop-banners.png"
  },
  {
    id: "apparel-branding",
    title: "Apparel Branding",
    shortDescription: "Custom t-shirts, hoodies, uniforms, and corporate wear.",
    description: "Turn your team into brand ambassadors with high-quality custom apparel. We offer screen printing, embroidery, and heat transfer services.",
    icon: Shirt,
    applications: ["Corporate uniforms", "Event t-shirts", "Safety wear (PPE)", "Promotional caps"],
    materials: ["Cotton", "Polyester Blends", "Embroidery Thread", "Heat Transfer Vinyl"],
    image: "/work/apparel-hoodie-2.jpg"
  },
  {
    id: "privacy-fence",
    title: "Privacy Fence Branding",
    shortDescription: "Printed mesh and vinyl for construction & perimeter fences.",
    description: "Transform your construction hoarding or perimeter fence into a powerful brand statement. We print and install large-format graphics on mesh and solid vinyl.",
    icon: Fence,
    applications: ["Construction sites", "Stadium hoardings", "Events perimeter", "Carpark fencing"],
    materials: ["Printed Mesh", "Solid Vinyl", "Banner Material", "Eyelet-reinforced Fabric"],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80"
  },
  {
    id: "wallpapers",
    title: "Wall Murals & Wallpapers",
    shortDescription: "Custom printed wall murals and decorative wallpapers.",
    description: "Transform any interior with custom wall murals, printed wallpapers, and large-format wall graphics for offices, hotels, restaurants, and homes.",
    icon: Wallpaper,
    applications: ["Office feature walls", "Restaurant decor", "Hotel lobbies", "Retail interiors"],
    materials: ["Non-woven Wallpaper", "Self-adhesive Vinyl", "Fabric Wall Covering", "UV-printed Board"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80"
  },
  {
    id: "receipt-books",
    title: "Receipt Books",
    shortDescription: "Custom carbonless receipt and invoice booklets.",
    description: "Professionally printed custom receipt books, invoice pads, and carbonless duplicate/triplicate booklets. Keep your business looking sharp and organised.",
    icon: BookMarked,
    applications: ["Sales receipts", "Delivery notes", "Invoice books", "Order pads"],
    materials: ["Carbonless NCR Paper", "Single Copy", "Duplicate", "Triplicate"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80"
  },
  {
    id: "mug-printing",
    title: "Mug Printing",
    shortDescription: "Custom branded mugs and corporate gifts.",
    description: "High-quality sublimation printing on ceramic mugs for corporate gifts, promotional giveaways, merchandise, and personal keepsakes.",
    icon: Coffee,
    applications: ["Corporate gifts", "Promotional giveaways", "Event merchandise", "Personal keepsakes"],
    materials: ["White Ceramic", "Coloured Ceramic", "Magic Colour-change", "Enamel"],
    image: "/work/branded-bottles.png"
  }
];
