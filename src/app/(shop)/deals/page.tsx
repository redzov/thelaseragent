import type { Metadata } from "next";
import { Suspense } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import ProductPagination from "@/components/product/ProductPagination";
import ProductFilter from "@/components/product/ProductFilter";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import {
  getProducts,
  getAllManufacturers,
  getAllYears,
} from "@/lib/products";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Laser Deals & Special Offers | ${SITE_NAME}`,
  description:
    "Discover the best deals on pre-owned cosmetic, medical, and aesthetic laser machines. Special pricing on top brands.",
  openGraph: {
    title: `Laser Deals & Special Offers | ${SITE_NAME}`,
    description:
      "Discover the best deals on pre-owned cosmetic, medical, and aesthetic laser machines.",
    url: "https://www.thelaseragent.com/deals",
  },
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    brand?: string;
    yearFrom?: string;
    yearTo?: string;
  }>;
}

export default async function DealsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const brand = params.brand || "";
  const yearFrom = params.yearFrom || "";
  const yearTo = params.yearTo || "";

  const manufacturers = getAllManufacturers();
  const years = getAllYears();

  const { products, total, totalPages } = getProducts({
    page,
    deals: true,
    brand: brand || undefined,
    yearFrom: yearFrom ? parseInt(yearFrom, 10) : undefined,
    yearTo: yearTo ? parseInt(yearTo, 10) : undefined,
  });

  // Build basePath preserving filters
  const filterParams = new URLSearchParams();
  if (brand) filterParams.set("brand", brand);
  if (yearFrom) filterParams.set("yearFrom", yearFrom);
  if (yearTo) filterParams.set("yearTo", yearTo);
  const queryString = filterParams.toString();
  const basePath = queryString ? `/deals?${queryString}` : "/deals";

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Deals" },
            ]}
          />
          <div className="flex items-center gap-3 mt-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Deals & Special Offers
            </h1>
            <span className="px-3 py-1 bg-[#5ABA47]/20 text-[#5ABA47] text-sm font-semibold rounded-full">
              SAVE
            </span>
          </div>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg">
            Take advantage of our best prices on pre-owned cosmetic, medical,
            and aesthetic laser machines.
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
