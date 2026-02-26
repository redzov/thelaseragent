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
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Laser Machines for Sale | ${SITE_NAME}`,
  description:
    "Browse our complete inventory of used cosmetic, medical, and aesthetic laser machines for sale. Top brands including Candela, Cynosure, Lumenis, and more.",
  openGraph: {
    title: `Laser Machines for Sale | ${SITE_NAME}`,
    description:
      "Browse our complete inventory of used cosmetic, medical, and aesthetic laser machines for sale.",
    url: `${SITE_URL}/laser-machines-for-sale`,
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

export default async function LaserMachinesForSalePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const brand = params.brand || "";
  const yearFrom = params.yearFrom || "";
  const yearTo = params.yearTo || "";

  const [manufacturers, years, result] = await Promise.all([
    getAllManufacturers(),
    getAllYears(),
    getProducts({
      page,
      brand: brand || undefined,
      yearFrom: yearFrom ? parseInt(yearFrom, 10) : undefined,
      yearTo: yearTo ? parseInt(yearTo, 10) : undefined,
    }),
  ]);

  const { products, total, totalPages } = result;

  const filterParams = new URLSearchParams();
  if (brand) filterParams.set("brand", brand);
  if (yearFrom) filterParams.set("yearFrom", yearFrom);
  if (yearTo) filterParams.set("yearTo", yearTo);
  const queryString = filterParams.toString();
  const basePath = queryString
    ? `/laser-machines-for-sale?${queryString}`
    : "/laser-machines-for-sale";

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Laser Machines for Sale" },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
            Laser Machines for Sale
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg">
            Browse our complete inventory of pre-owned cosmetic, medical, and
            aesthetic laser equipment from top manufacturers.
          </p>
        </div>
      </section>

      {/* Product Listing */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={null}>
            <ProductFilter manufacturers={manufacturers} years={years} />
          </Suspense>

          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm">
              Showing{" "}
              <span className="text-white font-medium">{products.length}</span> of{" "}
              <span className="text-white font-medium">{total}</span> products
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
