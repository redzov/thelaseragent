export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string;
  longDescription: string | null;
  price: number;
  callForPrice: boolean;
  sku: string | null;
  referenceNumber: string | null;
  manufacturer: string | null;
  model: string | null;
  year: number | null;
  applications: string | null;
  systemIncludes: string | null;
  status: "ACTIVE" | "SOLD" | "ARCHIVED";
  featured: boolean;
  isDeal: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  images: ProductImage[];
  categories: { category: Category }[];
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  type: "PRODUCT_TYPE" | "LASER_TYPE" | "BRAND" | "APPLICATION";
  description: string | null;
  heroImage: string | null;
}

export interface ProductListItem {
  id: number;
  slug: string;
  title: string;
  price: number;
  callForPrice: boolean;
  manufacturer: string | null;
  year: number | null;
  primaryImage: string | null;
}
