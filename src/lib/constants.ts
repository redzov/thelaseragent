export const SITE_NAME = "Phoenix Aesthetics";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.phoenixaesthetics.com";

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/people/Phoenix-Aesthetics/61587218723196/",
  twitter: "",
  instagram: "",
  linkedin: "",
};

export interface NavItem {
  label: string;
  href: string;
  children?: NavGroup[] | NavItem[];
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

function isNavGroup(item: NavGroup | NavItem): item is NavGroup {
  return "group" in item;
}

export { isNavGroup };

export const MAIN_NAV: NavItem[] = [
  { label: "HOME", href: "/" },
  { label: "INVENTORY", href: "/laser-machines-for-sale" },
  { label: "SELL A LASER", href: "/sell-a-laser" },
  { label: "SERVICE A LASER", href: "/laser-repair" },
  { label: "DEALS", href: "/deals" },
  { label: "SHIPPING & DELIVERY", href: "/shipping-delivery" },
  { label: "LASER FAQs", href: "/laser-faqs" },
  {
    label: "CONTACT US",
    href: "/contact",
    children: [
      { label: "Meet The Team", href: "/meet-the-team" },
      { label: "Customer Reviews", href: "/customer-reviews" },
    ] as NavItem[],
  },
];

export const PRODUCTS_PER_PAGE = 12;
export const ARTICLES_PER_PAGE = 10;

export const LASER_BRANDS = [
  "Alma",
  "BTL",
  "Candela",
  "Cutera",
  "Cutting Edge",
  "Cynosure",
  "HydraFacial",
  "Lumenis",
  "Lutronic",
  "Luxar",
  "Other",
  "Palomar",
  "Quanta",
  "Solta Medical",
  "Syneron",
  "Venus",
  "Vivace",
  "Zimmer",
];

export const SELL_FORM_LOOKING_TO = [
  { value: "buy", label: "Buy A Laser" },
  { value: "sell", label: "Sell A Laser" },
  { value: "trade", label: "Trade in A Laser" },
  { value: "service", label: "Service A Laser" },
];
