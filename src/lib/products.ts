import { prisma } from "@/lib/prisma";
import { Product, ProductListItem } from "@/types/product";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

// ---- Helpers ----

export function resolveImageUrl(url: string, slug: string): string {
  // Already an absolute URL
  if (url.startsWith("http")) return url;
  // Admin-uploaded images exist locally
  if (url.startsWith("/uploads/")) return url;
  // Product images served from external CDN (excluded from Vercel deploy)
  if (url.startsWith("/images/")) {
    return `https://www.thelaseragent.com${url}`;
  }
  // Seeded images from JSON: build external URL
  const filename = url.split("/").pop() || "image.jpg";
  return `https://www.thelaseragent.com/images/products/${slug}/${filename}`;
}

// ---- Public API ----

export interface ProductListResult {
  products: ProductListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getProducts(options?: {
  page?: number;
  perPage?: number;
  brand?: string;
  yearFrom?: number;
  yearTo?: number;
  category?: string;
  deals?: boolean;
}): Promise<ProductListResult> {
  const page = options?.page || 1;
  const perPage = options?.perPage || PRODUCTS_PER_PAGE;

  // Build where clause
  const where: Record<string, unknown> = {
    status: "ACTIVE",
  };

  if (options?.brand) {
    where.manufacturer = { equals: options.brand, mode: "insensitive" };
  }

  if (options?.yearFrom || options?.yearTo) {
    where.year = {
      ...(options?.yearFrom ? { gte: options.yearFrom } : {}),
      ...(options?.yearTo ? { lte: options.yearTo } : {}),
    };
  }

  if (options?.category) {
    where.categories = {
      some: {
        category: {
          slug: options.category.toLowerCase(),
        },
      },
    };
  }

  if (options?.deals) {
    where.isDeal = true;
  }

  // If deals filter is set but no deals exist, fallback to all products
  if (options?.deals) {
    const dealCount = await prisma.product.count({ where: where as never });
    if (dealCount === 0) {
      delete where.isDeal;
    }
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where: where as never }),
    prisma.product.findMany({
      where: where as never,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { sortOrder: "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const items: ProductListItem[] = products.map((p) => {
    const primaryImg = p.images[0];
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: Number(p.price),
      callForPrice: p.callForPrice,
      manufacturer: p.manufacturer,
      year: p.year,
      primaryImage: primaryImg ? resolveImageUrl(primaryImg.url, p.slug) : null,
    };
  });

  return { products: items, total, page, totalPages };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  if (!p) return null;

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    longDescription: p.longDescription,
    price: Number(p.price),
    callForPrice: p.callForPrice,
    sku: p.sku,
    referenceNumber: p.referenceNumber,
    manufacturer: p.manufacturer,
    model: p.model,
    year: p.year,
    applications: p.applications,
    systemIncludes: p.systemIncludes,
    status: p.status,
    featured: p.featured,
    isDeal: p.isDeal,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    ogImage: p.ogImage,
    images: p.images.map((img) => ({
      id: img.id,
      url: resolveImageUrl(img.url, p.slug),
      alt: img.alt,
      sortOrder: img.sortOrder,
      isPrimary: img.isPrimary,
    })),
    categories: p.categories.map((pc) => ({
      category: {
        id: pc.category.id,
        slug: pc.category.slug,
        name: pc.category.name,
        type: pc.category.type,
        description: pc.category.description,
        heroImage: pc.category.heroImage,
      },
    })),
  };
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
    orderBy: { sortOrder: "asc" },
  });
  return products.map((p) => p.slug);
}

export async function getRelatedProducts(slug: string): Promise<ProductListItem[]> {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!product) return [];

  const relations = await prisma.productRelation.findMany({
    where: { fromProductId: product.id },
    include: {
      toProduct: {
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });

  return relations.map((rel) => {
    const p = rel.toProduct;
    const primaryImg = p.images[0];
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: Number(p.price),
      callForPrice: p.callForPrice,
      manufacturer: p.manufacturer,
      year: p.year,
      primaryImage: primaryImg ? resolveImageUrl(primaryImg.url, p.slug) : null,
    };
  });
}

export async function getAllManufacturers(): Promise<string[]> {
  const results = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      manufacturer: { not: null },
    },
    select: { manufacturer: true },
    distinct: ["manufacturer"],
    orderBy: { manufacturer: "asc" },
  });

  return results
    .map((r) => r.manufacturer!)
    .filter(Boolean);
}

export async function getAllYears(): Promise<number[]> {
  const results = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      year: { not: null },
    },
    select: { year: true },
    distinct: ["year"],
    orderBy: { year: "desc" },
  });

  return results.map((r) => r.year!).filter(Boolean);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    where: {
      products: {
        some: {
          product: { status: "ACTIVE" },
        },
      },
    },
    select: { slug: true },
  });

  return categories.map((c) => c.slug);
}

export async function getCategoryNameBySlug(catSlug: string): Promise<string | null> {
  const category = await prisma.category.findUnique({
    where: { slug: catSlug },
    select: { name: true },
  });

  return category?.name || null;
}
