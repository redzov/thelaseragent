export interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  featuredImage: string | null;
  author: string;
  publishedAt: string;
  updatedAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  categories: { blogCategory: BlogCategory }[];
}

export interface BlogCategory {
  id: number;
  slug: string;
  name: string;
}

export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  author: string;
  publishedAt: string;
  categories: { blogCategory: BlogCategory }[];
}
