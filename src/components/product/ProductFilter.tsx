"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface ProductFilterProps {
  manufacturers: string[];
  years: number[];
}

export default function ProductFilter({
  manufacturers,
  years,
}: ProductFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [yearFrom, setYearFrom] = useState(searchParams.get("yearFrom") || "");
  const [yearTo, setYearTo] = useState(searchParams.get("yearTo") || "");

  useEffect(() => {
    setBrand(searchParams.get("brand") || "");
    setYearFrom(searchParams.get("yearFrom") || "");
    setYearTo(searchParams.get("yearTo") || "");
  }, [searchParams]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (yearFrom) params.set("yearFrom", yearFrom);
    if (yearTo) params.set("yearTo", yearTo);

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }, [brand, yearFrom, yearTo, pathname, router]);

  const clearFilters = useCallback(() => {
    setBrand("");
    setYearFrom("");
    setYearTo("");
    router.push(pathname);
  }, [pathname, router]);

  const hasFilters = brand || yearFrom || yearTo;

  const sortedYears = [...years].sort((a, b) => b - a);
  const sortedManufacturers = [...manufacturers].sort();

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        {/* Filter icon + label */}
        <div className="flex items-center gap-2 text-gray-400 text-sm flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Filters</span>
        </div>

        {/* Brand */}
        <div className="flex-1 w-full sm:w-auto">
          <label
            htmlFor="filter-brand"
            className="block text-xs text-gray-500 mb-1"
          >
            Brand
          </label>
          <select
            id="filter-brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full bg-[#111] border border-[#333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#5ABA47] transition-colors"
          >
            <option value="">All Brands</option>
            {sortedManufacturers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Year From */}
        <div className="flex-1 w-full sm:w-auto">
          <label
            htmlFor="filter-year-from"
            className="block text-xs text-gray-500 mb-1"
          >
            Year From
          </label>
          <select
            id="filter-year-from"
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            className="w-full bg-[#111] border border-[#333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#5ABA47] transition-colors"
          >
            <option value="">Any</option>
            {sortedYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Year To */}
        <div className="flex-1 w-full sm:w-auto">
          <label
            htmlFor="filter-year-to"
            className="block text-xs text-gray-500 mb-1"
          >
            Year To
          </label>
          <select
            id="filter-year-to"
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            className="w-full bg-[#111] border border-[#333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#5ABA47] transition-colors"
          >
            <option value="">Any</option>
            {sortedYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Apply / Clear buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-[#5ABA47] text-white text-sm font-medium rounded-md hover:bg-[#348923] transition-colors"
          >
            Apply
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
