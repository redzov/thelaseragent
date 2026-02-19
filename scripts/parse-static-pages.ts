import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const MIRROR_BASE = path.resolve(
  __dirname,
  "../../laseragent-mirror/www.thelaseragent.com"
);
const OUTPUT_DIR = path.resolve(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "static-pages.json");

interface StaticPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string | null;
  bodyHtml: string;
  bodyText: string;
}

const STATIC_PAGES = [
  "privacy-and-policy",
  "terms-and-conditions",
  "financing",
  "training",
  "shipping-delivery",
  "laser-repair",
  "videos",
  "medical-laser-supplies",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanBodyHtml($: cheerio.CheerioAPI, contentEl: cheerio.Cheerio<any>): string {
  // Remove script tags
  contentEl.find("script").remove();
  // Remove style tags
  contentEl.find("style").remove();
  // Remove navigation elements
  contentEl.find(".pp-advanced-menu, .pp-menu-nav, nav").remove();
  // Remove separator modules
  contentEl.find(".fl-module-separator").remove();
  // Remove icon/button modules that are just CTAs
  contentEl.find(".fl-module-pp-smart-button").remove();
  // Remove social icon modules
  contentEl.find(".fl-module-pp-social-icons").remove();
  // Remove gravity forms
  contentEl.find(".gform_wrapper, .fl-module-gravityforms").remove();
  // Remove the contact form areas
  contentEl.find(".fl-module-contact-form").remove();
  // Remove empty columns/rows
  contentEl.find(".fl-col-content:empty").parent().remove();

  // Extract meaningful content: headings, paragraphs, lists from rich-text blocks
  const blocks: string[] = [];

  // Find heading modules
  contentEl
    .find(
      ".fl-module-pp-heading h1, .fl-module-pp-heading h2, .fl-module-heading h3"
    )
    .each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, " ");
      if (text && text.length > 1) {
        const tag = el.tagName || "h2";
        blocks.push(`<${tag}>${text}</${tag}>`);
      }
    });

  // Find rich-text blocks (the main content)
  contentEl.find(".fl-rich-text").each((_, el) => {
    const $el = $(el);
    // Skip if it's just a nav link or very short
    const text = $el.text().trim();
    if (text.length < 10) return;

    // Get inner HTML and clean it
    let html = $el.html() || "";

    // Remove inline styles
    html = html.replace(/\s*style="[^"]*"/g, "");
    // Remove data attributes
    html = html.replace(/\s*data-[a-z-]+="[^"]*"/g, "");
    // Remove class attributes
    html = html.replace(/\s*class="[^"]*"/g, "");
    // Remove empty spans
    html = html.replace(/<span>\s*<\/span>/g, "");
    // Collapse whitespace
    html = html.replace(/\n\s*\n/g, "\n");

    if (html.trim()) {
      blocks.push(html.trim());
    }
  });

  // Find video embeds
  contentEl.find(".fl-video iframe, .pp-video-iframe").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    if (src) {
      blocks.push(
        `<div class="video-embed"><iframe src="${src}" allowfullscreen></iframe></div>`
      );
    }
  });

  return blocks.join("\n\n");
}

function parseStaticPage(slug: string): StaticPage | null {
  const filePath = path.join(MIRROR_BASE, slug, "index.html");

  if (!fs.existsSync(filePath)) {
    console.warn(`  WARNING: Page not found: ${slug}`);
    return null;
  }

  console.log(`  Parsing: ${slug}`);
  const html = fs.readFileSync(filePath, "utf-8");
  const $ = cheerio.load(html);

  // Meta tags
  const metaTitle = $("title").text().trim();
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || "";
  const ogImage = $('meta[property="og:image"]').attr("content") || null;

  // Page title from the first h1 or h2
  let title = "";
  const h1 = $("h1.heading-title .title-text.pp-primary-title")
    .first()
    .text()
    .trim();
  const h2 = $("h2.heading-title .title-text.pp-primary-title")
    .first()
    .text()
    .trim();
  title = h1 || h2 || "";

  // Clean up title - remove extra whitespace and span artifacts
  title = title.replace(/\s+/g, " ").trim();

  // If no title found from heading elements, try the meta title (clean it)
  if (!title && metaTitle) {
    title = metaTitle.split("|")[0].trim().split(" - ")[0].trim();
  }

  // Extract body content from the primary builder content area
  const primaryContent = $(".fl-builder-content-primary");
  let bodyHtml = "";

  if (primaryContent.length > 0) {
    bodyHtml = cleanBodyHtml($, primaryContent);
  } else {
    // Fallback to fl-post-content
    const postContent = $(".fl-post-content");
    if (postContent.length > 0) {
      bodyHtml = cleanBodyHtml($, postContent);
    }
  }

  // Generate plain text version
  const bodyText = bodyHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    slug,
    title,
    metaTitle,
    metaDescription,
    ogImage,
    bodyHtml,
    bodyText,
  };
}

function main() {
  console.log("=== Parsing Static Pages ===\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  const pages: StaticPage[] = [];
  let found = 0;
  let missing = 0;

  for (const slug of STATIC_PAGES) {
    const page = parseStaticPage(slug);
    if (page) {
      pages.push(page);
      found++;
      console.log(
        `    Title: "${page.title}" (${page.bodyText.length} chars text)`
      );
    } else {
      missing++;
    }
  }

  console.log(`\nResults:`);
  console.log(`  Found: ${found} pages`);
  console.log(`  Missing: ${missing} pages`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(pages, null, 2), "utf-8");
  console.log(`\nOutput written to: ${OUTPUT_FILE}`);
}

main();
