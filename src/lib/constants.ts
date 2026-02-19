export const SITE_NAME = "The Laser Agent";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thelaseragent.com";
export const PHONE_PRIMARY = "+1-317-570-0448";
export const PHONE_PRIMARY_TEL = "tel:+13175700448";
export const PHONE_BEVERLY_HILLS = "(463) 222-2155";
export const PHONE_BEVERLY_HILLS_TEL = "tel:+14632222155";
export const PHONE_NEW_YORK = "(315) 812-3622";
export const PHONE_NEW_YORK_TEL = "tel:+13158123622";

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/thelaseragent/",
  twitter: "https://twitter.com/TheLaserAgent",
  instagram: "https://www.instagram.com/thelaseragent/",
  linkedin: "https://www.linkedin.com/company/thelaseragent",
};

export const OFFICES = [
  {
    name: "Noblesville HQ",
    address: "15402 Stoney Creek Way, Noblesville, IN 46060",
    phone: PHONE_PRIMARY,
    phoneTel: PHONE_PRIMARY_TEL,
    mapUrl: "https://maps.app.goo.gl/XQYsVv5FrqzUvpQm7",
  },
  {
    name: "Beverly Hills",
    address: "8383 Wilshire Blvd #800, Beverly Hills, CA 90211",
    phone: PHONE_BEVERLY_HILLS,
    phoneTel: PHONE_BEVERLY_HILLS_TEL,
    mapUrl: "https://maps.app.goo.gl/iiUqKyaKPbBi43HKA",
  },
  {
    name: "New York",
    address: "112 W 34th St., New York, NY 10120",
    phone: PHONE_NEW_YORK,
    phoneTel: PHONE_NEW_YORK_TEL,
    mapUrl: "https://maps.app.goo.gl/XJZsKUyTq6BS3SUh7",
  },
];

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
  {
    label: "RESOURCES",
    href: "#",
    children: [
      { label: "Laser FAQs", href: "/laser-faqs" },
      { label: "Customer Education", href: "/customer-education" },
      { label: "Videos", href: "/videos" },
      { label: "Medical Laser Supplies", href: "/medical-laser-supplies" },
      { label: "Training", href: "/training" },
      { label: "Financing", href: "/financing" },
    ] as NavItem[],
  },
  {
    label: "CONTACT US",
    href: "/contact",
    children: [
      { label: "Meet The Team", href: "/meet-the-team" },
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
