import fs from "fs";
import path from "path";

export interface StaticPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  bodyHtml: string;
  bodyText: string;
}

let cachedPages: StaticPage[] | null = null;

function loadPages(): StaticPage[] {
  if (cachedPages) return cachedPages;

  const filePath = path.join(process.cwd(), "scripts", "data", "static-pages.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedPages = JSON.parse(raw) as StaticPage[];
  return cachedPages;
}

export function getStaticPageBySlug(slug: string): StaticPage | undefined {
  const pages = loadPages();
  return pages.find((page) => page.slug === slug);
}

export function getAllStaticPages(): StaticPage[] {
  return loadPages();
}
