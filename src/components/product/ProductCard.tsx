import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  slug: string;
  title: string;
  price: number;
  callForPrice: boolean;
  manufacturer: string | null;
  year: number | null;
  primaryImage: string | null;
}

export default function ProductCard({
  slug,
  title,
  price,
  callForPrice,
  manufacturer,
  year,
  primaryImage,
}: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className="group block">
      <article className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-transparent transition-all duration-300 group-hover:scale-[1.02] group-hover:border-[#2196F3]/40 group-hover:shadow-[0_0_20px_rgba(90,186,71,0.15)]">
        {/* Image */}
        <div className="relative aspect-square bg-[#111]">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Manufacturer & Year */}
          {(manufacturer || year) && (
            <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
              {[manufacturer, year].filter(Boolean).join(" | ")}
            </p>
          )}

          {/* Title */}
          <h3 className="text-white text-base font-medium leading-snug line-clamp-2 mb-3 min-h-[2.75rem]">
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between">
            {callForPrice || price === 0 ? (
              <span className="text-[#2196F3] font-semibold text-sm">
                Call for Price
              </span>
            ) : (
              <span className="text-white font-semibold text-lg">
                {formatPrice(price)}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-3 pt-3 border-t border-[#333]">
            <span className="text-[#2196F3] text-sm font-medium group-hover:underline inline-flex items-center gap-1">
              Learn More
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
