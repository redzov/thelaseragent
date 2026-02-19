import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const MIRROR_BASE = path.resolve(
  __dirname,
  "../../laseragent-mirror/www.thelaseragent.com"
);
const OUTPUT_DIR = path.resolve(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "categories.json");

type CategoryType = "PRODUCT_TYPE" | "BRAND" | "LASER_TYPE" | "APPLICATION";

interface Category {
  slug: string;
  name: string;
  type: CategoryType;
  description: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string | null;
}

const CATEGORY_DEFINITIONS: { slug: string; type: CategoryType }[] = [
  // PRODUCT_TYPE
  { slug: "aesthetic-lasers-for-sale", type: "PRODUCT_TYPE" },
  { slug: "cosmetic-lasers-for-sale", type: "PRODUCT_TYPE" },
  { slug: "medical-lasers-for-sale", type: "PRODUCT_TYPE" },

  // APPLICATION
  { slug: "spa-machines-for-sale", type: "APPLICATION" },
  { slug: "tatto-removal-laser-machines-for-sale", type: "APPLICATION" },

  // LASER_TYPE
  { slug: "alexandrite-lasers-for-sale", type: "LASER_TYPE" },
  { slug: "yag-lasers-for-sale", type: "LASER_TYPE" },
  { slug: "ipl-machines-for-sale", type: "LASER_TYPE" },
  { slug: "holmium-lasers", type: "LASER_TYPE" },

  // BRAND
  { slug: "alma-lasers", type: "BRAND" },
  { slug: "btl-lasers", type: "BRAND" },
  { slug: "candela-lasers", type: "BRAND" },
  { slug: "cutera-lasers", type: "BRAND" },
  { slug: "cutting-edge-lasers", type: "BRAND" },
  { slug: "cynosure-lasers", type: "BRAND" },
  { slug: "hydrafacial-lasers", type: "BRAND" },
  { slug: "lumenis-lasers", type: "BRAND" },
  { slug: "lutronic-lasers", type: "BRAND" },
  { slug: "luxar-lasers", type: "BRAND" },
  { slug: "palomar-lasers", type: "BRAND" },
  { slug: "quanta-lasers", type: "BRAND" },
  { slug: "solta-medical-lasers", type: "BRAND" },
  { slug: "syneron-lasers", type: "BRAND" },
  { slug: "venus-lasers", type: "BRAND" },
  { slug: "vivace-lasers", type: "BRAND" },
  { slug: "zimmer-lasers", type: "BRAND" },
  { slug: "other-cosmetic-lasers", type: "BRAND" },
];

// Some brand pages use different directory names in the mirror
const SLUG_ALIASES: Record<string, string[]> = {
  "cutera-lasers": ["cutera-lasers-for-sale", "cutera-lasers"],
};

function findPagePath(slug: string): string | null {
  // Try the slug directly
  const directPath = path.join(MIRROR_BASE, slug, "index.html");
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  // Try aliases
  const aliases = SLUG_ALIASES[slug];
  if (aliases) {
    for (const alias of aliases) {
      const aliasPath = path.join(MIRROR_BASE, alias, "index.html");
      if (fs.existsSync(aliasPath)) {
        return aliasPath;
      }
    }
  }

  return null;
}

function parseCategoryPage(
  slug: string,
  type: CategoryType
): Category | null {
  const filePath = findPagePath(slug);

  if (!filePath) {
    console.warn(`  WARNING: Page not found for slug "${slug}"`);
    return {
      slug,
      name: slugToName(slug),
      type,
      description: "",
      metaTitle: "",
      metaDescription: "",
      heroImage: null,
    };
  }

  console.log(`  Parsing: ${slug}`);
  const html = fs.readFileSync(filePath, "utf-8");
  const $ = cheerio.load(html);

  // Extract meta title from <title> tag
  const metaTitle = $("title").text().trim();

  // Extract meta description
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || "";

  // Extract og:image for hero image
  const heroImage =
    $('meta[property="og:image"]').attr("content") || null;

  // The page structure has:
  // - header[data-type="header"] - site header
  // - #fl-main-content .fl-page-content - actual page body content
  // - footer[data-type="footer"] - site footer with testimonials
  //
  // We need to look ONLY in the main page content area, excluding header/footer.
  // Category pages: content is in .fl-page-content
  // Regular pages: content is in .fl-builder-content-primary or .fl-post-content

  // Remove footer and header from consideration
  $('footer, [data-type="footer"], [data-type="header"]').remove();

  // Now find the main content area
  const mainContent = $("#fl-main-content").length > 0
    ? $("#fl-main-content")
    : $(".fl-page-content").length > 0
      ? $(".fl-page-content")
      : $(".fl-builder-content-primary").length > 0
        ? $(".fl-builder-content-primary")
        : $(".fl-post-content");

  // Extract page name from h1 within the main content
  let name = "";

  // First try h1 tags (common for category pages)
  mainContent.find("h1").each((_, el) => {
    if (name) return;
    const text = $(el).text().trim().replace(/\s+/g, " ");
    if (text && text.length > 2) {
      name = text;
    }
  });

  // If no h1, try h2 heading-title within main content
  if (!name) {
    mainContent.find("h2.heading-title .title-text.pp-primary-title").each((_, el) => {
      if (name) return;
      const text = $(el).text().trim().replace(/\s+/g, " ");
      if (text && text.length > 2) {
        name = text;
      }
    });
  }

  // Fallback to slug-based name
  if (!name) {
    name = slugToName(slug);
  }

  // Extract description from the first substantial rich-text block in main content
  let description = "";

  mainContent.find(".fl-rich-text").each((_, el) => {
    if (description) return; // Take first substantial one

    const $el = $(el);
    const text = $el.text().trim();

    // Skip very short texts (nav items, single links, phone numbers)
    if (text.length < 80) return;

    // Extract just the text content of paragraphs
    const paragraphs: string[] = [];
    $el.find("p").each((__, pEl) => {
      const pText = $(pEl).text().trim();
      if (pText.length > 20) {
        paragraphs.push(pText);
      }
    });

    if (paragraphs.length > 0) {
      description = paragraphs.join("\n\n");
    } else if (text.length >= 80) {
      description = text;
    }
  });

  // Also try pp-sub-heading within main content
  if (!description) {
    mainContent.find(".pp-sub-heading").each((_, el) => {
      if (description) return;
      const text = $(el).text().trim();
      if (text && text.length > 30) {
        description = text;
      }
    });
  }

  return {
    slug,
    name,
    type,
    description,
    metaTitle,
    metaDescription,
    heroImage,
  };
}

function slugToName(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/For Sale/i, "for Sale");
}

function main() {
  console.log("=== Parsing Category & Brand Pages ===\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  const categories: Category[] = [];
  let found = 0;
  let missing = 0;

  for (const { slug, type } of CATEGORY_DEFINITIONS) {
    const category = parseCategoryPage(slug, type);
    if (category) {
      categories.push(category);
      if (category.metaTitle) {
        found++;
      } else {
        missing++;
      }
    }
  }

  console.log(`\nResults:`);
  console.log(`  Found: ${found} pages with content`);
  console.log(`  Missing/empty: ${missing} pages`);
  console.log(`  Total: ${categories.length} categories`);

  // Group summary
  const grouped = categories.reduce(
    (acc, cat) => {
      acc[cat.type] = (acc[cat.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log("\nBy type:");
  for (const [type, count] of Object.entries(grouped)) {
    console.log(`  ${type}: ${count}`);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(categories, null, 2), "utf-8");
  console.log(`\nOutput written to: ${OUTPUT_FILE}`);
}

main();
