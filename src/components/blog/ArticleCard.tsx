import Image from "next/image";
import Link from "next/link";
import { ArticleListItem } from "@/types/article";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function truncateExcerpt(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

function cleanTitle(title: string): string {
  return title.replace(/ - The [Ll]aser Agent$/i, "");
}

type ArticleCardProps = Pick<
  ArticleListItem,
  "slug" | "title" | "excerpt" | "featuredImage" | "author" | "publishedAt" | "categories"
>;

export default function ArticleCard({
  slug,
  title,
  excerpt,
  featuredImage,
  author,
  publishedAt,
  categories,
}: ArticleCardProps) {
  const displayTitle = cleanTitle(title);

  return (
    <Link href={`/article/${slug}`} className="group block">
      <article className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-transparent transition-all duration-300 group-hover:scale-[1.02] group-hover:border-[#5ABA47]/40 group-hover:shadow-[0_0_20px_rgba(90,186,71,0.15)] h-full flex flex-col">
        {/* Featured Image */}
        <div className="relative aspect-[16/9] bg-[#111] overflow-hidden">
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={displayTitle}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
        <div className="p-5 flex flex-col flex-1">
          {/* Categories + Date */}
          <div className="flex items-center gap-3 mb-3 text-xs">
            {categories.length > 0 && (
              <span className="text-[#5ABA47] font-medium uppercase tracking-wide">
                {categories[0].blogCategory.name}
              </span>
            )}
            <span className="text-gray-500">{formatDate(publishedAt)}</span>
          </div>

          {/* Title */}
          <h3 className="text-white text-base font-semibold leading-snug line-clamp-2 mb-3 min-h-[2.75rem] group-hover:text-[#5ABA47] transition-colors">
            {displayTitle}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-[#c9c9c9] text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
              {truncateExcerpt(excerpt, 100)}
            </p>
          )}

          {/* CTA */}
          <div className="mt-auto pt-3 border-t border-[#333]">
            <span className="text-[#5ABA47] text-sm font-medium group-hover:underline inline-flex items-center gap-1">
              Read More
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
