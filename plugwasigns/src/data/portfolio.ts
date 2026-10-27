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
  items: PortfolioItem[];
}

const rawData = portfolioData as any;

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
