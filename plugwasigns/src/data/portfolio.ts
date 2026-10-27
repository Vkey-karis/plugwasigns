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

export const CATEGORIES = [
  "ALL",
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
] as const;

export const EDITABLE_CATEGORIES = [
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
] as const;

export const PORTFOLIO: PortfolioItem[] = portfolioData as PortfolioItem[];
