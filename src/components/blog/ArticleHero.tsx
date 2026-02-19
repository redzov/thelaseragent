import Image from "next/image";
import Link from "next/link";
import { BlogCategory } from "@/types/article";

interface ArticleHeroProps {
  title: string;
  featuredImage: string | null;
  author: string;
  publishedAt: string;
  categories: { blogCategory: BlogCategory }[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function cleanTitle(title: string): string {
  return title.replace(/ - The [Ll]aser Agent$/i, "");
}

export default function ArticleHero({
  title,
  featuredImage,
  author,
  publishedAt,
  categories,
}: ArticleHeroProps) {
  const displayTitle = cleanTitle(title);

  return (
    <section className="relative w-full min-h-[400px] sm:min-h-[500px] flex items-end">
      {/* Background Image */}
      {featuredImage ? (
        <Image
          src={featuredImage}
          alt={displayTitle}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] to-[#1a1a1a]" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        {/* Category badges */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(({ blogCategory }) => (
              <Link
                key={blogCategory.slug}
                href={`/category/${blogCategory.slug}`}
                className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wide bg-[#5ABA47]/20 text-[#5ABA47] rounded-full hover:bg-[#5ABA47]/30 transition-colors"
              >
                {blogCategory.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          {displayTitle}
        </h1>

        {/* Author + Date */}
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <span className="capitalize">{author}</span>
          <span className="text-gray-500">|</span>
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </div>
      </div>
    </section>
  );
}
