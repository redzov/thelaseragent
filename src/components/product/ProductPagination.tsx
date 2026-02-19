import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function getPageNumbers(current: number, total: number): (number | "dots")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "dots")[] = [];

  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push("dots");
    pages.push(total);
  } else if (current >= total - 3) {
    pages.push(1);
    pages.push("dots");
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push("dots");
    pages.push(current - 1);
    pages.push(current);
    pages.push(current + 1);
    pages.push("dots");
    pages.push(total);
  }

  return pages;
}

function getPageHref(basePath: string, page: number): string {
  if (page === 1) return basePath;
  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}page=${page}`;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  basePath,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageHref(basePath, currentPage - 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-400 bg-[#1a1a1a] hover:bg-[#252525] hover:text-white transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-600 bg-[#1a1a1a] cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "dots") {
            return (
              <span
                key={`dots-${index}`}
                className="w-10 h-10 flex items-center justify-center text-gray-500 text-sm"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return isActive ? (
            <span
              key={page}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium bg-[#5ABA47] text-white"
              aria-current="page"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={getPageHref(basePath, page)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-sm text-gray-400 bg-[#1a1a1a] hover:bg-[#252525] hover:text-white transition-colors"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageHref(basePath, currentPage + 1)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-400 bg-[#1a1a1a] hover:bg-[#252525] hover:text-white transition-colors"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-600 bg-[#1a1a1a] cursor-not-allowed">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
