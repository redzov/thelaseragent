import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArticleGrid from "@/components/blog/ArticleGrid";
import BlogPagination from "@/components/blog/BlogPagination";
import {
  getArticles,
  getAllCategorySlugs,
  getCategoryNameBySlug,
} from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = getCategoryNameBySlug(slug);

  if (!categoryName) {
    return {
      title: `Category Not Found | ${SITE_NAME}`,
    };
  }

  const title = `${categoryName} Articles | ${SITE_NAME}`;
  const description = `Browse our ${categoryName.toLowerCase()} articles about used laser equipment, industry insights, and expert guidance.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/category/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const categoryName = getCategoryNameBySlug(slug);

  if (!categoryName) {
    notFound();
  }

  const page = resolvedSearchParams.page
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;

  const { articles, totalPages, currentPage } = getArticles(
    page,
    undefined,
    slug
  );

  const basePath = `/category/${slug}`;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Customer Education", href: "/customer-education" },
              { label: categoryName },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
            {categoryName}
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg">
            Browse all articles in the {categoryName.toLowerCase()} category.
          </p>
        </div>
      </section>

      {/* Article Listing */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm">
              Showing{" "}
              <span className="text-white font-medium">{articles.length}</span>{" "}
              articles
            </p>
          </div>

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
