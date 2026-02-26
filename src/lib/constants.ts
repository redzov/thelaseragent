export const SITE_NAME = "Phoenix Aesthetics";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.phoenixaesthetics.com";

export const SOCIAL_LINKS = {
  facebook: "",
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
  {
    label: "LASERS",
    href: "#",
    children: [
      {
        group: "Lasers by Type",
        items: [
          { label: "Aesthetic Lasers", href: "/aesthetic-lasers-for-sale" },
          { label: "Cosmetic Lasers", href: "/cosmetic-lasers-for-sale" },
          { label: "Medical Lasers", href: "/medical-lasers-for-sale" },
        ],
      },
      {
        group: "Lasers by Application",
        items: [
          { label: "Spa Laser Machines", href: "/spa-machines-for-sale" },
          { label: "Tattoo Removal Machines", href: "/tatto-removal-laser-machines-for-sale" },
          { label: "Alexandrite Lasers", href: "/alexandrite-lasers-for-sale" },
          { label: "YAG Lasers", href: "/yag-lasers-for-sale" },
          { label: "IPL Machines", href: "/ipl-machines-for-sale" },
        ],
      },
    ] as NavGroup[],
  },
  {
    label: "BUY A LASER",
    href: "/laser-machines-for-sale",
    children: [
      { label: "Alma Lasers", href: "/alma-lasers" },
      { label: "BTL Lasers", href: "/btl-lasers" },
      { label: "Candela Lasers", href: "/candela-lasers" },
      { label: "Cutera Lasers", href: "/cutera-lasers" },
      { label: "Cutting Edge Lasers", href: "/cutting-edge-lasers" },
      { label: "Cynosure Lasers", href: "/cynosure-lasers" },
      { label: "HydraFacial", href: "/hydrafacial-lasers" },
      { label: "Lumenis Lasers", href: "/lumenis-lasers" },
      { label: "Lutronic Lasers", href: "/lutronic-lasers" },
      { label: "Luxar Lasers", href: "/luxar-lasers" },
      { label: "Palomar Lasers", href: "/palomar-lasers" },
      { label: "Quanta Lasers", href: "/quanta-lasers" },
      { label: "Solta Medical", href: "/solta-medical-lasers" },
      { label: "Syneron Lasers", href: "/syneron-lasers" },
      { label: "Venus Lasers", href: "/venus-lasers" },
      { label: "Vivace", href: "/vivace-lasers" },
      { label: "Zimmer Lasers", href: "/zimmer-lasers" },
      { label: "Other Lasers", href: "/other-cosmetic-lasers" },
      { label: "All Laser Brands", href: "/all-laser-brands" },
    ] as NavItem[],
  },
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
