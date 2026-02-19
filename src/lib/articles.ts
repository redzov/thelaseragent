import { Article, ArticleListItem, BlogCategory } from "@/types/article";
import { ARTICLES_PER_PAGE } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import articlesData from "../../scripts/data/articles.json";
import categoriesData from "../../scripts/data/blog-categories.json";

// Types for raw JSON data
interface RawArticle {
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  publishedAt: string;
  modifiedAt: string;
  categories: string[];
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

interface RawBlogCategory {
  name: string;
  slug: string;
}

const allArticles = articlesData as RawArticle[];
const allCategories = categoriesData as RawBlogCategory[];

function categoryNameToBlogCategory(name: string): BlogCategory {
  const found = allCategories.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  return {
    id: found ? allCategories.indexOf(found) + 1 : 0,
    slug: found ? found.slug : slugify(name),
    name: found ? found.name : name,
  };
}

function rawToArticleListItem(raw: RawArticle, index: number): ArticleListItem {
  return {
    id: index + 1,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt || null,
    featuredImage: raw.featuredImage || null,
    author: raw.author,
    publishedAt: raw.publishedAt,
    categories: raw.categories.map((name) => ({
      blogCategory: categoryNameToBlogCategory(name),
    })),
  };
}

function rawToArticle(raw: RawArticle, index: number): Article {
  return {
    id: index + 1,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt || null,
    body: raw.body,
    featuredImage: raw.featuredImage || null,
    author: raw.author,
    publishedAt: raw.publishedAt,
    updatedAt: raw.modifiedAt,
    metaTitle: raw.metaTitle || null,
    metaDescription: raw.metaDescription || null,
    categories: raw.categories.map((name) => ({
      blogCategory: categoryNameToBlogCategory(name),
    })),
  };
}

// ---- Public API ----

export interface ArticleListResult {
  articles: ArticleListItem[];
  totalPages: number;
  currentPage: number;
}

export function getArticles(
  page: number = 1,
  pageSize: number = ARTICLES_PER_PAGE,
  categorySlug?: string
): ArticleListResult {
  let filtered = allArticles;

  if (categorySlug) {
    filtered = filtered.filter((a) =>
      a.categories.some(
        (name) => categoryNameToBlogCategory(name).slug === categorySlug
      )
    );
  }

  // Articles are already sorted by publishedAt desc in the JSON
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const articles = filtered
    .slice(start, end)
    .map((raw, i) => rawToArticleListItem(raw, start + i));

  return { articles, totalPages, currentPage: page };
}

export function getArticleBySlug(slug: string): Article | null {
  const index = allArticles.findIndex((a) => a.slug === slug);
  if (index === -1) return null;
  return rawToArticle(allArticles[index], index);
}

export function getAllArticleSlugs(): string[] {
  return allArticles.map((a) => a.slug);
}

export function getBlogCategories(): BlogCategory[] {
  return allCategories.map((c, i) => ({
    id: i + 1,
    slug: c.slug,
    name: c.name,
  }));
}

export function getAdjacentArticles(
  slug: string
): { prev: { slug: string; title: string } | null; next: { slug: string; title: string } | null } {
  const index = allArticles.findIndex((a) => a.slug === slug);
  if (index === -1) return { prev: null, next: null };

  const prev =
    index < allArticles.length - 1
      ? { slug: allArticles[index + 1].slug, title: allArticles[index + 1].title }
      : null;

  const next =
    index > 0
      ? { slug: allArticles[index - 1].slug, title: allArticles[index - 1].title }
      : null;

  return { prev, next };
}

export function getCategoryNameBySlug(catSlug: string): string | null {
  const found = allCategories.find((c) => c.slug === catSlug);
  return found ? found.name : null;
}

export function getAllCategorySlugs(): string[] {
  return allCategories.map((c) => c.slug);
}
