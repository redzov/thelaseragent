import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArticleGrid from "@/components/blog/ArticleGrid";
import BlogPagination from "@/components/blog/BlogPagination";
import { getArticles, getBlogCategories } from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Customer Education | ${SITE_NAME}`,
  description:
    "Stay informed with our latest articles about used laser equipment. Guides, tips, and industry insights for buying, selling, and maintaining cosmetic and medical lasers.",
  openGraph: {
    title: `Customer Education | ${SITE_NAME}`,
    description:
      "Stay informed with our latest articles about used laser equipment.",
    url: `${SITE_URL}/customer-education`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Customer Education | ${SITE_NAME}`,
    description:
      "Stay informed with our latest articles about used laser equipment.",
  },
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

export default async function CustomerEducationPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const categorySlug = params.category || undefined;
  const categories = getBlogCategories();

  const { articles, totalPages, currentPage } = getArticles(
    page,
    undefined,
    categorySlug
  );

  // Build basePath preserving filters
  const filterParams = new URLSearchParams();
  if (categorySlug) filterParams.set("category", categorySlug);
  const queryString = filterParams.toString();
  const basePath = queryString
    ? `/customer-education?${queryString}`
    : "/customer-education";

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Customer Education" },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
            Customer Education
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg">
            Stay informed with our latest articles about used laser equipment.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mt-8">
            <Link
              href="/customer-education"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !categorySlug
                  ? "bg-[#5ABA47] text-white"
                  : "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/customer-education?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categorySlug === cat.slug
                    ? "bg-[#5ABA47] text-white"
                    : "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-white"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Article Listing */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Active filter info */}
          {activeCategory && (
            <div className="flex items-center gap-2 mb-6">
              <p className="text-gray-400 text-sm">
                Showing articles in{" "}
                <span className="text-white font-medium">
                  {activeCategory.name}
                </span>
              </p>
            </div>
          )}

          <ArticleGrid articles={articles} />

          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={basePath}
          />
        </div>
      </section>
    </div>
  );
}
