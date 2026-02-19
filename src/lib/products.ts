import { Product, ProductListItem } from "@/types/product";
import { getProductImagePath, slugify } from "@/lib/utils";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import productsData from "../../scripts/data/products.json";

// Types for raw JSON data
interface RawProduct {
  title: string;
  slug: string;
  description: string;
  descriptionHtml: string;
  price: number;
  callForPrice: boolean;
  images: string[];
  manufacturer: string;
  model: string;
  applications: string[];
  referenceNumber: string;
  systemIncludes: string;
  categories: string[];
  relatedProducts: string[];
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  sku: number;
  year: number;
  isDeal?: boolean;
}

const allProducts = productsData as RawProduct[];

function rawToProductListItem(raw: RawProduct, index: number): ProductListItem {
  const primaryImage =
    raw.images.length > 0
      ? getProductImagePath(raw.slug, raw.images[0])
      : null;

  return {
    id: index + 1,
    slug: raw.slug,
    title: raw.title,
    price: raw.price,
    callForPrice: raw.callForPrice,
    manufacturer: raw.manufacturer || null,
    year: raw.year || null,
    primaryImage,
  };
}

function rawToProduct(raw: RawProduct, index: number): Product {
  const images = raw.images.map((url, imgIndex) => ({
    id: imgIndex + 1,
    url: getProductImagePath(raw.slug, url),
    alt: `${raw.title} - Image ${imgIndex + 1}`,
    sortOrder: imgIndex,
    isPrimary: imgIndex === 0,
  }));

  const categories = raw.categories.map((name, catIndex) => ({
    category: {
      id: catIndex + 1,
      slug: slugify(name),
      name,
      type: "PRODUCT_TYPE" as const,
      description: null,
      heroImage: null,
    },
  }));

  return {
    id: index + 1,
    slug: raw.slug,
    title: raw.title,
    description: raw.description,
    longDescription: raw.descriptionHtml || null,
    price: raw.price,
    callForPrice: raw.callForPrice,
    sku: raw.sku ? String(raw.sku) : null,
    referenceNumber: raw.referenceNumber || null,
    manufacturer: raw.manufacturer || null,
    model: raw.model || null,
    year: raw.year || null,
    applications: raw.applications ? raw.applications.join(", ") : null,
    systemIncludes: raw.systemIncludes || null,
    status: "ACTIVE",
    featured: false,
    isDeal: raw.isDeal || false,
    metaTitle: raw.metaTitle || null,
    metaDescription: raw.metaDescription || null,
    ogImage: raw.ogImage || null,
    images,
    categories,
  };
}

// ---- Public API ----

export interface ProductListResult {
  products: ProductListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export function getProducts(options?: {
  page?: number;
  perPage?: number;
  brand?: string;
  yearFrom?: number;
  yearTo?: number;
  category?: string;
  deals?: boolean;
}): ProductListResult {
  const page = options?.page || 1;
  const perPage = options?.perPage || PRODUCTS_PER_PAGE;

  let filtered = allProducts;

  if (options?.brand) {
    filtered = filtered.filter(
      (p) => p.manufacturer?.toLowerCase() === options.brand!.toLowerCase()
    );
  }

  if (options?.yearFrom) {
    filtered = filtered.filter((p) => p.year && p.year >= options.yearFrom!);
  }

  if (options?.yearTo) {
    filtered = filtered.filter((p) => p.year && p.year <= options.yearTo!);
  }

  if (options?.category) {
    const catSlug = options.category.toLowerCase();
    filtered = filtered.filter((p) =>
      p.categories.some((c) => slugify(c) === catSlug)
    );
  }

  if (options?.deals) {
    const dealProducts = filtered.filter((p) => p.isDeal);
    if (dealProducts.length > 0) {
      filtered = dealProducts;
    }
    // If no deals are flagged, show all products as per spec
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const products = filtered
    .slice(start, end)
    .map((raw, i) => rawToProductListItem(raw, start + i));

  return { products, total, page, totalPages };
}

export function getProductBySlug(slug: string): Product | null {
  const index = allProducts.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return rawToProduct(allProducts[index], index);
}

export function getAllProductSlugs(): string[] {
  return allProducts.map((p) => p.slug);
}

export function getRelatedProducts(slug: string): ProductListItem[] {
  const raw = allProducts.find((p) => p.slug === slug);
  if (!raw || !raw.relatedProducts) return [];

  return raw.relatedProducts
    .map((relSlug) => {
      const index = allProducts.findIndex((p) => p.slug === relSlug);
      if (index === -1) return null;
      return rawToProductListItem(allProducts[index], index);
    })
    .filter((p): p is ProductListItem => p !== null);
}

export function getAllManufacturers(): string[] {
  const mfgSet = new Set<string>();
  allProducts.forEach((p) => {
    if (p.manufacturer) mfgSet.add(p.manufacturer);
  });
  return Array.from(mfgSet).sort();
}

export function getAllYears(): number[] {
  const yearSet = new Set<number>();
  allProducts.forEach((p) => {
    if (p.year) yearSet.add(p.year);
  });
  return Array.from(yearSet).sort((a, b) => b - a);
}

export function getAllCategorySlugs(): string[] {
  const catSet = new Set<string>();
  allProducts.forEach((p) => {
    p.categories.forEach((c) => catSet.add(slugify(c)));
  });
  return Array.from(catSet);
}

export function getCategoryNameBySlug(catSlug: string): string | null {
  for (const product of allProducts) {
    for (const cat of product.categories) {
      if (slugify(cat) === catSlug) return cat;
    }
  }
  return null;
}
