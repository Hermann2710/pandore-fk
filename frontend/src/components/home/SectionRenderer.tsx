import type { HomepageSection } from "@/types";
import HeroCarousel from "./HeroCarousel";
import ProductRow from "./ProductRow";
import CategoryBanner from "./CategoryBanner";
import PromoBanner from "./PromoBanner";

interface Props { section: HomepageSection; }

// Single dispatch point — adding a new section type only requires
// creating a new component and adding one line here.
export default function SectionRenderer({ section }: Props) {
  switch (section.type) {
    case "hero_carousel":   return <HeroCarousel section={section} />;
    case "product_row":     return <ProductRow section={section} />;
    case "category_banner": return <CategoryBanner section={section} />;
    case "promo_banner":    return <PromoBanner section={section} />;
    default:                return null;
  }
}
