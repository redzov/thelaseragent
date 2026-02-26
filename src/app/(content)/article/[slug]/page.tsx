import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArticleHero from "@/components/blog/ArticleHero";
import ArticleBody from "@/components/blog/ArticleBody";
import SocialShare from "@/components/blog/SocialShare";
import ArticleNav from "@/components/blog/ArticleNav";
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getAdjacentArticles,
} from "@/lib/articles";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: `Article Not Found | ${SITE_NAME}`,
    };
  }

  const cleanedTitle = article.title.replace(/ - The [Ll]aser Agent$/i, "");
  const title = article.metaTitle || `${cleanedTitle} | ${SITE_NAME}`;
  const description =
    article.metaDescription ||
    article.excerpt ||
    `Read "${cleanedTitle}" on the Phoenix Aesthetics blog.`;
  const ogImage = article.featuredImage || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/article/${article.slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

function cleanTitle(title: string): string {
  return title.replace(/ - The [Ll]aser Agent$/i, "");
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { prev, next } = getAdjacentArticles(slug);
  const articleUrl = `${SITE_URL}/article/${article.slug}`;
  const displayTitle = cleanTitle(article.title);

  return (
    <div>
      {/* Breadcrumbs */}
      <section className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Customer Education", href: "/customer-education" },
              { label: displayTitle },
            ]}
          />
        </div>
      </section>

      {/* Hero */}
      <ArticleHero
        title={article.title}
        featuredImage={article.featuredImage}
        author={article.author}
        publishedAt={article.publishedAt}
        categories={article.categories}
      />

      {/* Article Content */}
      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleBody html={article.body} />

          {/* Social Share */}
          <div className="mt-10 pt-8 border-t border-[#333]">
            <SocialShare url={articleUrl} title={displayTitle} />
          </div>

          {/* Prev/Next Navigation */}
          <div className="mt-10">
            <ArticleNav prev={prev} next={next} />
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: displayTitle,
            description: article.excerpt,
            image: article.featuredImage || undefined,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            author: {
              "@type": "Person",
              name: article.author,
            },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": articleUrl,
            },
          }),
        }}
      />
    </div>
  );
}
