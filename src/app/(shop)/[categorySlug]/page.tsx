import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import ProductPagination from "@/components/product/ProductPagination";
import ProductFilter from "@/components/product/ProductFilter";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  getProducts,
  getCategoryNameBySlug,
  getAllManufacturers,
  getAllYears,
} from "@/lib/products";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{
    page?: string;
    brand?: string;
    yearFrom?: string;
    yearTo?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const categoryName = await getCategoryNameBySlug(categorySlug);

  if (!categoryName) {
    return {
      title: `Category Not Found | ${SITE_NAME}`,
    };
  }

  const title = `${categoryName} | ${SITE_NAME}`;
  const description = `Browse our selection of ${categoryName.toLowerCase()}. Quality pre-owned laser equipment from Phoenix Aesthetics.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { categorySlug } = await params;
  const sp = await searchParams;
  const categoryName = await getCategoryNameBySlug(categorySlug);

  if (!categoryName) {
    notFound();
  }

  const page = sp.page ? parseInt(sp.page, 10) : 1;
  const brand = sp.brand || "";
  const yearFrom = sp.yearFrom || "";
  const yearTo = sp.yearTo || "";

  const [manufacturers, years, result] = await Promise.all([
    getAllManufacturers(),
    getAllYears(),
    getProducts({
      page,
      category: categorySlug,
      brand: brand || undefined,
      yearFrom: yearFrom ? parseInt(yearFrom, 10) : undefined,
      yearTo: yearTo ? parseInt(yearTo, 10) : undefined,
    }),
  ]);

  const { products, total, totalPages } = result;

  // Build basePath preserving filters
  const filterParams = new URLSearchParams();
  if (brand) filterParams.set("brand", brand);
  if (yearFrom) filterParams.set("yearFrom", yearFrom);
  if (yearTo) filterParams.set("yearTo", yearTo);
  const queryString = filterParams.toString();
  const basePath = queryString
    ? `/${categorySlug}?${queryString}`
    : `/${categorySlug}`;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              {
                label: "Laser Machines for Sale",
                href: "/laser-machines-for-sale",
              },
              { label: categoryName },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
            {categoryName}
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg">
            Browse our selection of pre-owned {categoryName.toLowerCase()}{" "}
            available for purchase.
          </p>
        </div>
      </section>

      {/* Product Listing */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={null}>
            <ProductFilter manufacturers={manufacturers} years={years} />
          </Suspense>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm">
              Showing{" "}
              <span className="text-white font-medium">{products.length}</span>{" "}
              of <span className="text-white font-medium">{total}</span>{" "}
              products
            </p>
          </div>

          <ProductGrid products={products} />

          <ProductPagination
            currentPage={page}
            totalPages={totalPages}
            basePath={basePath}
          />
        </div>
      </section>
    </div>
  );
}
