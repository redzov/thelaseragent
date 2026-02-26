import Link from "next/link";
import Image from "next/image";
import articlesData from "../../../scripts/data/articles.json";

interface Article {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
}

// Sort by publishedAt desc and take first 3
const recentArticles: Article[] = (articlesData as Article[])
  .sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  .slice(0, 3);

function truncateExcerpt(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

// Strip " - The laser Agent" suffix from titles for cleaner display
function cleanTitle(title: string): string {
  return title.replace(/ - The [Ll]aser Agent$/i, "").replace(/ - Phoenix Aesthetics$/i, "");
}

export default function RecentBlogPosts() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          Recent Posts
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="group block"
            >
              <article className="bg-[#1a1a1a] rounded-lg overflow-hidden h-full flex flex-col">
                {/* Featured image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={article.featuredImage}
                    alt={cleanTitle(article.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-[#5ABA47] transition-colors line-clamp-2">
                    {cleanTitle(article.title)}
                  </h3>

                  <p className="text-[#c9c9c9] text-sm leading-relaxed mb-4 flex-1">
                    {truncateExcerpt(article.excerpt, 100)}
                  </p>

                  <span className="text-[#5ABA47] text-sm font-medium inline-flex items-center">
                    Read More
                    <svg
                      className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
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
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
