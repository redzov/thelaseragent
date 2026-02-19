/**
 * Article Parser Script
 *
 * Parses all blog article HTML pages from the thelaseragent.com mirror.
 * Identifies articles by the presence of `article:published_time` meta tag.
 *
 * Outputs:
 *   - scripts/data/articles.json
 *   - scripts/data/blog-categories.json
 *
 * Usage:
 *   npx tsx scripts/parse-articles.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MIRROR_ROOT = path.resolve(
  __dirname,
  "../../laseragent-mirror/www.thelaseragent.com"
);
const OUTPUT_DIR = path.resolve(__dirname, "data");
const ARTICLES_OUTPUT = path.join(OUTPUT_DIR, "articles.json");
const CATEGORIES_OUTPUT = path.join(OUTPUT_DIR, "blog-categories.json");

// Directories to skip -- these are never blog articles
const SKIP_DIRS = new Set([
  "product",
  "category",
  "feed",
  "wp-content",
  "wp-json",
  "wp-includes",
  "wp-admin",
  "page",
  // Weird mirror artifact
  "'+$(this).data('thumb')+'.html",
]);

// Some articles in the mirror lack `article:published_time` but are confirmed blog articles
// (they have og:type=article, article:modified_time, and article content).
// We include them via a known slugs fallback list.
const KNOWN_ARTICLE_SLUGS = new Set([
  "best-deals-on-used-laser-for-sale-for-hair-removal-and-skin-care",
  "ipl-for-spider-vein-treatments",
  "used-cosmetic-lasers-for-aesthetic-professionals",
]);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Article {
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

interface BlogCategory {
  name: string;
  slug: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip HTML tags and collapse whitespace to produce plain text.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Clean article body HTML:
 *  - Remove Beaver Builder wrapper divs (fl-row, fl-col, fl-module wrappers)
 *  - Keep semantic content (p, h1-h6, ul, ol, li, a, img, strong, em, blockquote, table, etc.)
 *  - Remove inline style tags and script tags
 *  - Remove noscript tags (duplicate lazy-load images)
 *  - Clean up lazy-loaded image src attributes
 */
function cleanArticleHtml(rawHtml: string): string {
  const $ = cheerio.load(rawHtml, { xml: { decodeEntities: false } });

  // Remove script, style, noscript tags
  $("script").remove();
  $("style").remove();
  $("noscript").remove();

  // Remove Beaver Builder CTA sections (these are shared template blocks, not article content)
  $(".fl-module-cta").remove();
  $('[class*="CTA-background"]').remove();

  // Remove post navigation
  $(".fl-module-fl-post-navigation").remove();
  $(".nav-post").remove();

  // Remove "Posted in" category HTML module
  $(".fl-module-html").each((_i, el) => {
    const text = $(el).text();
    if (text.trim().startsWith("Posted in")) {
      $(el).remove();
    }
  });

  // Remove separator modules
  $(".fl-module-separator").remove();

  // Remove Beaver Builder related posts / slider widgets
  $(".fl-module-post-slider-and-carousel").remove();
  $('[class*="post-slider"]').remove();

  // Fix lazy-loaded images: use data-lazy-src as the actual src
  $("img").each((_i, el) => {
    const $el = $(el);
    const lazySrc = $el.attr("data-lazy-src");
    const lazySrcset = $el.attr("data-lazy-srcset");

    if (lazySrc) {
      $el.attr("src", lazySrc);
      $el.removeAttr("data-lazy-src");
    }

    if (lazySrcset) {
      $el.attr("srcset", lazySrcset);
      $el.removeAttr("data-lazy-srcset");
    }

    $el.removeAttr("data-lazy-sizes");

    // Clean up SVG placeholder srcs
    const src = $el.attr("src") || "";
    if (src.startsWith("data:image/svg+xml")) {
      const realSrc = $el.attr("srcset");
      if (realSrc) {
        // Use first srcset entry
        const firstSrc = realSrc.split(",")[0].trim().split(" ")[0];
        $el.attr("src", firstSrc);
      }
    }

    // Remove excessive attributes
    $el.removeAttr("fetchpriority");
    $el.removeAttr("decoding");
    $el.removeAttr("data-rocket-lazy");
  });

  // Extract content from fl-rich-text divs (the actual article content)
  const richTextBlocks: string[] = [];
  $(".fl-rich-text").each((_i, el) => {
    richTextBlocks.push($(el).html() || "");
  });

  // If we found rich text blocks, use them; otherwise fall back to the whole body
  let cleanedHtml: string;
  if (richTextBlocks.length > 0) {
    cleanedHtml = richTextBlocks.join("\n");
  } else {
    // Fallback: look for fl-module-rich-text modules
    const moduleBlocks: string[] = [];
    $(".fl-module-rich-text .fl-module-content").each((_i, el) => {
      moduleBlocks.push($(el).html() || "");
    });
    cleanedHtml = moduleBlocks.length > 0 ? moduleBlocks.join("\n") : $.html();
  }

  // Final cleanup pass on the extracted HTML
  const $clean = cheerio.load(cleanedHtml, { xml: { decodeEntities: false } });

  // Remove any remaining BB wrapper divs while preserving their children
  // We want to unwrap: fl-row, fl-col, fl-module, fl-node-content, fl-col-content,
  // fl-row-content, fl-builder-content, etc.
  const bbWrapperSelectors = [
    ".fl-row-content-wrap",
    ".fl-row-content",
    ".fl-col-group",
    ".fl-col-content",
    ".fl-module-content",
    ".fl-node-content",
    '[class^="fl-builder-content"]',
    ".uabb-row-separator",
    ".uabb-js-breakpoint",
  ];

  for (const selector of bbWrapperSelectors) {
    $clean(selector).each((_i, el) => {
      $clean(el).replaceWith($clean(el).html() || "");
    });
  }

  // Remove empty divs
  $clean("div:empty").remove();

  // Remove inline styles from spans that only set font-weight
  $clean("span").each((_i, el) => {
    const style = $clean(el).attr("style") || "";
    if (/^font-weight:\s*\d+;?$/.test(style.trim())) {
      $clean(el).replaceWith($clean(el).html() || "");
    }
  });

  let result = $clean.html() || "";

  // Remove excessive whitespace and newlines
  result = result
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+$/gm, "")
    .trim();

  return result;
}

/**
 * Extract categories from Yoast schema JSON-LD, falling back to "Posted in" links.
 */
function extractCategories($: cheerio.CheerioAPI): string[] {
  const categories: string[] = [];

  // Strategy 1: Yoast Schema JSON-LD articleSection
  $('script.yoast-schema-graph, script[type="application/ld+json"]').each(
    (_i, el) => {
      try {
        const json = JSON.parse($(el).text());
        const graph = json["@graph"] || [];
        for (const node of graph) {
          if (node["@type"] === "Article" && node.articleSection) {
            const sections = Array.isArray(node.articleSection)
              ? node.articleSection
              : [node.articleSection];
            categories.push(...sections);
          }
        }
      } catch {
        // Malformed JSON, skip
      }
    }
  );

  if (categories.length > 0) return [...new Set(categories)];

  // Strategy 2: "Posted in" links with rel="tag"
  $('a[rel="tag"]').each((_i, el) => {
    const href = $(el).attr("href") || "";
    if (href.includes("/category/")) {
      const text = $(el).text().trim();
      if (text) categories.push(text);
    }
  });

  return [...new Set(categories)];
}

/**
 * Try to extract the "Posted in" category links from the body.
 */
function extractCategoryLinks($: cheerio.CheerioAPI): BlogCategory[] {
  const cats: BlogCategory[] = [];
  $('a[rel="tag"]').each((_i, el) => {
    const href = $(el).attr("href") || "";
    if (href.includes("/category/")) {
      const name = $(el).text().trim();
      // Extract slug from href like ../category/guides/index.html or /category/aesthetic-lasers/
      const slugMatch = href.match(/\/category\/([^/]+)/);
      if (slugMatch && name) {
        cats.push({ name, slug: slugMatch[1] });
      }
    }
  });
  return cats;
}

// ---------------------------------------------------------------------------
// Main Parser
// ---------------------------------------------------------------------------

function parseArticle(dirPath: string, slug: string): Article | null {
  const indexPath = path.join(dirPath, "index.html");
  if (!fs.existsSync(indexPath)) return null;

  const html = fs.readFileSync(indexPath, "utf-8");
  const $ = cheerio.load(html);

  // Check if this is an article by looking for article:published_time meta tag
  // or by being in the known article slugs fallback list
  const publishedTime = $(
    'meta[property="article:published_time"]'
  ).attr("content");

  const isKnownArticle = KNOWN_ARTICLE_SLUGS.has(slug);

  if (!publishedTime && !isKnownArticle) return null;

  // Extract metadata from meta tags
  const ogTitle =
    $('meta[property="og:title"]').attr("content") || "";
  const ogDescription =
    $('meta[property="og:description"]').attr("content") || "";
  const ogImage =
    $('meta[property="og:image"]').attr("content") || "";
  const author =
    $('meta[name="author"]').attr("content") || "";
  const modifiedTime =
    $('meta[property="article:modified_time"]').attr("content") || "";
  const pageTitle = $("title").text().trim();

  // For articles without published_time, use modified_time as fallback
  const effectivePublishedTime = publishedTime || modifiedTime || "";

  // Use og:title as primary, fall back to page <title>
  const title = ogTitle || pageTitle;

  // Extract categories
  const categories = extractCategories($);

  // Extract article body content
  // The main article content is in fl-rich-text divs within fl-module-rich-text modules
  // We need to find the content area (not header/footer template blocks)

  // First, get all fl-rich-text blocks
  const allRichTextHtml: string[] = [];

  // The article content is typically in fl-builder-content blocks that are NOT
  // global templates (header/footer). Look for fl-module-rich-text elements.
  // Exclude header (data-type="header") and footer (data-type="footer") regions.
  const $contentArea = $(".fl-page-content, .fl-builder-content").not(
    '[data-type="header"], [data-type="footer"], .fl-builder-global-templates-locked'
  );

  if ($contentArea.length > 0) {
    $contentArea.find(".fl-rich-text").each((_i, el) => {
      allRichTextHtml.push($.html(el));
    });
  }

  // Fallback: if no content area found, get all fl-rich-text that aren't in header/footer
  if (allRichTextHtml.length === 0) {
    $(".fl-rich-text").each((_i, el) => {
      // Skip if inside footer or header templates
      const parent = $(el).closest(
        '[data-type="header"], [data-type="footer"]'
      );
      if (parent.length === 0) {
        allRichTextHtml.push($.html(el));
      }
    });
  }

  // Combine and clean the article body
  const rawBody = allRichTextHtml.join("\n");
  const body = cleanArticleHtml(rawBody);

  // Generate excerpt from body text content
  const textContent = stripHtml(body);
  const excerpt = textContent.length > 200
    ? textContent.substring(0, 200).replace(/\s+\S*$/, "") + "..."
    : textContent;

  return {
    title,
    slug,
    body,
    excerpt,
    featuredImage: ogImage,
    author,
    publishedAt: effectivePublishedTime,
    modifiedAt: modifiedTime,
    categories,
    metaTitle: ogTitle || pageTitle,
    metaDescription: ogDescription,
    ogImage,
  };
}

function main() {
  console.log("=== Article Parser ===");
  console.log(`Mirror root: ${MIRROR_ROOT}`);
  console.log(`Output dir:  ${OUTPUT_DIR}`);
  console.log("");

  if (!fs.existsSync(MIRROR_ROOT)) {
    console.error(`ERROR: Mirror root not found at ${MIRROR_ROOT}`);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Scan all directories in the mirror root
  const entries = fs.readdirSync(MIRROR_ROOT, { withFileTypes: true });
  const directories = entries
    .filter((e) => e.isDirectory() && !SKIP_DIRS.has(e.name))
    .map((e) => e.name);

  console.log(`Found ${directories.length} directories to scan...`);
  console.log("");

  const articles: Article[] = [];
  const allCategories = new Map<string, BlogCategory>();
  let scanned = 0;
  let skipped = 0;

  for (const dirName of directories) {
    const dirPath = path.join(MIRROR_ROOT, dirName);
    scanned++;

    const article = parseArticle(dirPath, dirName);
    if (article) {
      articles.push(article);
      console.log(
        `  [${articles.length}] ${article.slug} -> "${article.title}" (${article.categories.join(", ") || "uncategorized"})`
      );

      // Collect categories
      // Also parse the HTML again briefly for category links with slugs
      const indexPath = path.join(dirPath, "index.html");
      const html = fs.readFileSync(indexPath, "utf-8");
      const $ = cheerio.load(html);
      const catLinks = extractCategoryLinks($);
      for (const cat of catLinks) {
        allCategories.set(cat.slug, cat);
      }
    } else {
      skipped++;
    }
  }

  // Also scan the /category/ directory for blog categories directly
  const categoryDir = path.join(MIRROR_ROOT, "category");
  if (fs.existsSync(categoryDir)) {
    const catEntries = fs.readdirSync(categoryDir, { withFileTypes: true });
    for (const catEntry of catEntries) {
      if (catEntry.isDirectory()) {
        const catSlug = catEntry.name;
        if (!allCategories.has(catSlug)) {
          // Try to get the category name from the page
          const catIndexPath = path.join(
            categoryDir,
            catSlug,
            "index.html"
          );
          if (fs.existsSync(catIndexPath)) {
            const catHtml = fs.readFileSync(catIndexPath, "utf-8");
            const $cat = cheerio.load(catHtml);
            const catTitle =
              $cat('meta[property="og:title"]').attr("content") || "";
            // og:title is usually like "Aesthetic Lasers Archives - The laser Agent"
            const cleanName = catTitle
              .replace(/\s*Archives?\s*[-|].*$/i, "")
              .trim();
            allCategories.set(catSlug, {
              name: cleanName || catSlug,
              slug: catSlug,
            });
          }
        }
      }
    }
  }

  // Sort articles by publishedAt date (newest first)
  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Convert categories map to sorted array
  const categoriesArray = Array.from(allCategories.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Write outputs
  fs.writeFileSync(ARTICLES_OUTPUT, JSON.stringify(articles, null, 2), "utf-8");
  fs.writeFileSync(
    CATEGORIES_OUTPUT,
    JSON.stringify(categoriesArray, null, 2),
    "utf-8"
  );

  console.log("");
  console.log("=== Summary ===");
  console.log(`Directories scanned: ${scanned}`);
  console.log(`Articles found:      ${articles.length}`);
  console.log(`Non-articles skipped: ${skipped}`);
  console.log(`Categories found:    ${categoriesArray.length}`);
  console.log("");
  console.log(`Articles written to:    ${ARTICLES_OUTPUT}`);
  console.log(`Categories written to:  ${CATEGORIES_OUTPUT}`);

  // Warn if count differs from expected
  if (articles.length < 70) {
    console.warn(
      `\nWARNING: Expected ~88 articles but only found ${articles.length}. Some may have been missed.`
    );
  }

  // Print category summary
  console.log("\n=== Categories ===");
  for (const cat of categoriesArray) {
    const count = articles.filter((a) =>
      a.categories.includes(cat.name)
    ).length;
    console.log(`  ${cat.name} (${cat.slug}): ${count} articles`);
  }
}

main();
