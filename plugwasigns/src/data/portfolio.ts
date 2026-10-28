import portfolioData from './portfolio.json';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  services: string[];
  isHero?: boolean;
  isFeatured?: boolean;
  priority?: number;
}

export interface PortfolioDataStructure {
  categories: string[];
  categoryImages?: Record<string, string>;
  items: PortfolioItem[];
}

const rawData = portfolioData as any;

export const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "2D": "/work/gentry-spa.jpg",
  "3D": "/work/dazzle-3d.jpg",
  "STICKERS": "/work/reflective-exit-signs.png",
  "BRANDING": "/work/raffine-board.png",
  "VEHICLE": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80",
  "LED": "/work/neon-cocktail.jpg",
  "SHOP SIGNS": "/work/raffine-sign.png",
  "APPAREL": "/work/apparel-hoodie-2.jpg",
  "PRINT": "/work/eulogy-program.png",
  "DECOR": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80",
  "BANNERS": "/work/teardrop-banners.png"
};

export const CATEGORY_IMAGES: Record<string, string> = {
  ...DEFAULT_CATEGORY_IMAGES,
  ...(rawData?.categoryImages || {})
};

export const DEFAULT_CATEGORIES: string[] = Array.isArray(rawData)
  ? [
      "2D",
      "3D",
      "STICKERS",
      "BRANDING",
      "VEHICLE",
      "LED",
      "SHOP SIGNS",
      "APPAREL",
      "PRINT",
      "DECOR",
      "BANNERS"
    ]
  : rawData.categories;

export const CATEGORIES: string[] = ["ALL", ...DEFAULT_CATEGORIES];

export const EDITABLE_CATEGORIES: string[] = DEFAULT_CATEGORIES;

export const PORTFOLIO: PortfolioItem[] = Array.isArray(rawData)
  ? (rawData as PortfolioItem[])
  : (rawData.items as PortfolioItem[]);
