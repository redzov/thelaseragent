import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const MIRROR_PATH =
  process.env.MIRROR_PATH ||
  path.resolve(__dirname, "../../laseragent-mirror/www.thelaseragent.com");

const PRODUCT_DIR = path.join(MIRROR_PATH, "product");
const OUTPUT_DIR = path.resolve(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "products.json");

interface Product {
  title: string | null;
  slug: string;
  description: string | null;
  descriptionHtml: string | null;
  price: number | null;
  callForPrice: boolean;
  images: string[];
  manufacturer: string | null;
  model: string | null;
  applications: string[];
  referenceNumber: string | null;
  systemIncludes: string | null;
  categories: string[];
  relatedProducts: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  sku: string | null;
  year: number | null;
}

function normalizeImageUrl(rawUrl: string): string {
  // Strip ShortPixel CDN wrapper to get the original WordPress URL
  // Pattern: https://spcdn.shortpixel.ai/spio/ret_img,q_cdnize,to_webp,s_webp/www.thelaseragent.com/wp-content/...
  const shortPixelMatch = rawUrl.match(
    /spcdn\.shortpixel\.ai\/[^/]+\/www\.thelaseragent\.com(\/wp-content\/.+)/
  );
  if (shortPixelMatch) {
    return `https://www.thelaseragent.com${shortPixelMatch[1]}`;
  }

  // Handle relative paths like ../../wp-content/uploads/...
  const relativeMatch = rawUrl.match(/(\/wp-content\/uploads\/.+)/);
  if (relativeMatch) {
    return `https://www.thelaseragent.com${relativeMatch[1]}`;
  }

  // Already an absolute thelaseragent.com URL
  if (rawUrl.includes("www.thelaseragent.com/wp-content/")) {
    return rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  }

  return rawUrl;
}

function stripSizeVariant(url: string): string {
  // Remove WordPress image size suffixes like -300x300, -225x300, -100x100, -64x85, -150x150, -500x500
  return url.replace(/-\d+x\d+(\.\w+)$/, "$1");
}

function extractSlugFromRelatedLink(href: string): string | null {
  // Related product links use format: ../../index.html@p=1445.html
  // We cannot reliably map post IDs to slugs from the link alone.
  // Instead, we'll return null and rely on the title to match later.
  return null;
}

function extractSlugFromTitle(title: string): string {
  // Convert "2019 Candela GentleMax Pro" -> "2019-candela-gentlemax-pro"
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseProduct(htmlContent: string, slug: string): Product | null {
  const $ = cheerio.load(htmlContent);

  // --- Title ---
  const titleEl = $("h1.product_title.entry-title");
  const title = titleEl.length > 0 ? titleEl.text().trim() : null;

  // Fallback to og:title if h1 is missing
  const ogTitle =
    $('meta[property="og:title"]').attr("content")?.trim() || null;

  // --- Description ---
  const descriptionDiv = $(
    ".woocommerce-product-details__short-description"
  ).first();
  let description: string | null = null;
  let descriptionHtml: string | null = null;

  if (descriptionDiv.length > 0) {
    descriptionHtml = descriptionDiv.html()?.trim() || null;

    // Extract text content, excluding "System Includes" and "Reference Number" lines
    const paragraphs: string[] = [];
    descriptionDiv.find("p").each((_, el) => {
      const text = $(el).text().trim();
      if (
        text &&
        !text.startsWith("System Includes:") &&
        !text.startsWith("Reference Number:") &&
        text !== "\u00a0" // &nbsp;
      ) {
        // Skip paragraphs that only contain embedded video divs
        const hasOnlyVideo =
          $(el).find(".rll-youtube-player, iframe").length > 0 &&
          $(el)
            .contents()
            .filter(function () {
              return (
                this.type === "text" && $(this).text().trim().length > 0
              );
            }).length === 0;
        if (!hasOnlyVideo) {
          paragraphs.push(text);
        }
      }
    });
    description = paragraphs.length > 0 ? paragraphs.join("\n\n") : null;
  }

  // Fallback to og:description
  const ogDescription =
    $('meta[property="og:description"]').attr("content")?.trim() || null;
  if (!description && ogDescription) {
    description = ogDescription;
  }

  // --- Price ---
  // The main product page uses "Get Price" / "Make Offer" forms (no visible price).
  // The WooCommerce price is hidden or set to $0.00 for all products.
  // We look for the price in the main product content area (not in related products).
  let price: number | null = null;
  const mainContentDiv = $(
    '.fl-builder-content[class*="type-product"]'
  ).first();
  const mainPriceEl = mainContentDiv
    .find(
      ".woocommerce-Price-amount.amount"
    )
    .first();

  if (mainPriceEl.length > 0) {
    const priceText = mainPriceEl.text().replace(/[^0-9.]/g, "");
    const parsed = parseFloat(priceText);
    if (!isNaN(parsed)) {
      price = parsed;
    }
  }

  // All products effectively are "call for price" since they show $0.00
  const callForPrice = price === null || price === 0;

  // --- Images ---
  const images: string[] = [];
  const seenUrls = new Set<string>();

  // Primary method: gallery lightbox links in wpgs-for section
  $(".wpgs-for a.wpgs-lightbox-icon").each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const normalized = normalizeImageUrl(href);
      const fullSize = stripSizeVariant(normalized);
      if (!seenUrls.has(fullSize)) {
        seenUrls.add(fullSize);
        images.push(fullSize);
      }
    }
  });

  // Fallback: main product image with wp-post-image class
  if (images.length === 0) {
    $("img.wp-post-image").each((_, el) => {
      const src =
        $(el).attr("data-large_image") ||
        $(el).attr("data-o_img") ||
        $(el).attr("src");
      if (src && !src.startsWith("data:")) {
        const normalized = normalizeImageUrl(src);
        const fullSize = stripSizeVariant(normalized);
        if (!seenUrls.has(fullSize)) {
          seenUrls.add(fullSize);
          images.push(fullSize);
        }
      }
    });
  }

  // Fallback: gallery images from the woocommerce-product-gallery div
  if (images.length === 0) {
    $(".woocommerce-product-gallery__image img").each((_, el) => {
      const src =
        $(el).attr("data-large_image") ||
        $(el).attr("data-o_img") ||
        $(el).attr("src");
      if (src && !src.startsWith("data:")) {
        const normalized = normalizeImageUrl(src);
        const fullSize = stripSizeVariant(normalized);
        if (!seenUrls.has(fullSize)) {
          seenUrls.add(fullSize);
          images.push(fullSize);
        }
      }
    });
  }

  // --- Attributes table (manufacturer, model, applications) ---
  let manufacturer: string | null = null;
  let model: string | null = null;
  const applications: string[] = [];

  $("table.shop_attributes tr").each((_, row) => {
    const label = $(row)
      .find("th.woocommerce-product-attributes-item__label")
      .text()
      .trim()
      .toLowerCase();
    const value = $(row)
      .find("td.woocommerce-product-attributes-item__value")
      .text()
      .trim();

    if (label === "manufacturer" && value) {
      manufacturer = value;
    } else if (label === "model" && value) {
      model = value;
    } else if (label === "applications" && value) {
      value.split(",").forEach((app) => {
        const trimmed = app.trim();
        if (trimmed) applications.push(trimmed);
      });
    }
  });

  // --- Reference Number ---
  let referenceNumber: string | null = null;
  if (descriptionDiv.length > 0) {
    descriptionDiv.find("p").each((_, el) => {
      const text = $(el).text().trim();
      const refMatch = text.match(/Reference\s*Number:\s*(.+)/i);
      if (refMatch) {
        referenceNumber = refMatch[1].trim();
      }
    });
  }
  // Also check the raw HTML for reference numbers outside <p> tags
  if (!referenceNumber && descriptionHtml) {
    const refMatch = descriptionHtml.match(/Reference\s*Number:\s*([A-Z0-9]+)/i);
    if (refMatch) {
      referenceNumber = refMatch[1].trim();
    }
  }

  // --- System Includes ---
  let systemIncludes: string | null = null;
  if (descriptionDiv.length > 0) {
    descriptionDiv.find("p").each((_, el) => {
      const text = $(el).text().trim();
      const sysMatch = text.match(/System\s*Includes:\s*(.+)/i);
      if (sysMatch) {
        systemIncludes = sysMatch[1].trim();
      }
    });
  }
  if (!systemIncludes && descriptionHtml) {
    const sysMatch = descriptionHtml.match(/System\s*Includes:<\/strong>\s*(.+?)(?:<\/p>|<br)/i);
    if (sysMatch) {
      // Strip any remaining HTML tags from the match
      systemIncludes = sysMatch[1].replace(/<[^>]+>/g, "").trim();
    }
  }

  // --- Categories ---
  // Extracted from CSS classes on the main product content div
  // Pattern: product_cat-aesthetic-lasers-for-sale
  const categories: string[] = [];
  const productClasses =
    mainContentDiv.attr("class") || "";
  const catRegex = /product_cat-([a-z0-9-]+)/g;
  let catMatch: RegExpExecArray | null;
  while ((catMatch = catRegex.exec(productClasses)) !== null) {
    const cat = catMatch[1]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    categories.push(cat);
  }

  // --- Related Products ---
  const relatedProducts: string[] = [];
  $("section.related.products li.product").each((_, li) => {
    // Extract slug from the related product's title
    const relTitle = $(li)
      .find("h2.woocommerce-loop-product__title")
      .text()
      .trim();
    if (relTitle) {
      const relSlug = extractSlugFromTitle(relTitle);
      if (relSlug) {
        relatedProducts.push(relSlug);
      }
    }
  });

  // --- Meta Description ---
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    ogDescription;

  // --- OG Image ---
  const ogImage =
    $('meta[property="og:image"]').attr("content")?.trim() || null;

  // --- SKU ---
  // Check for span.sku element
  let sku: string | null = null;
  const skuEl = $("span.sku");
  if (skuEl.length > 0) {
    sku = skuEl.text().trim() || null;
  }

  // Fallback: try JSON-LD for SKU
  if (!sku) {
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const jsonText = $(el).text();
        const jsonData = JSON.parse(jsonText);
        // Yoast schema uses @graph array
        if (jsonData["@graph"]) {
          for (const item of jsonData["@graph"]) {
            if (item.sku) {
              sku = item.sku;
              break;
            }
          }
        } else if (jsonData.sku) {
          sku = jsonData.sku;
        }
      } catch {
        // Ignore JSON parse errors
      }
    });
  }

  // --- Year ---
  const displayTitle = title || ogTitle;
  let year: number | null = null;
  if (displayTitle) {
    const yearMatch = displayTitle.match(/^(\d{4})\b/);
    if (yearMatch) {
      const parsed = parseInt(yearMatch[1], 10);
      if (parsed >= 1990 && parsed <= 2030) {
        year = parsed;
      }
    }
  }
  // Fallback: parse year from slug
  if (year === null) {
    const slugYearMatch = slug.match(/^(\d{4})-/);
    if (slugYearMatch) {
      const parsed = parseInt(slugYearMatch[1], 10);
      if (parsed >= 1990 && parsed <= 2030) {
        year = parsed;
      }
    }
  }

  return {
    title: title || ogTitle,
    slug,
    description,
    descriptionHtml,
    price,
    callForPrice,
    images,
    manufacturer,
    model,
    applications,
    referenceNumber,
    systemIncludes,
    categories,
    relatedProducts,
    metaTitle: ogTitle,
    metaDescription,
    ogImage,
    sku,
    year,
  };
}

function main(): void {
  console.log(`Mirror path: ${MIRROR_PATH}`);
  console.log(`Product directory: ${PRODUCT_DIR}`);
  console.log(`Output file: ${OUTPUT_FILE}`);
  console.log("");

  if (!fs.existsSync(PRODUCT_DIR)) {
    console.error(`ERROR: Product directory not found: ${PRODUCT_DIR}`);
    console.error(
      "Set MIRROR_PATH env var to point to your mirror root (containing /product/ subdirectories)."
    );
    process.exit(1);
  }

  const productDirs = fs
    .readdirSync(PRODUCT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  console.log(`Found ${productDirs.length} product directories.\n`);

  const products: Product[] = [];
  const warnings: string[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < productDirs.length; i++) {
    const slug = productDirs[i];
    const indexPath = path.join(PRODUCT_DIR, slug, "index.html");

    const progress = `[${(i + 1).toString().padStart(3)}/${productDirs.length}]`;

    if (!fs.existsSync(indexPath)) {
      const msg = `${progress} WARNING: No index.html found for "${slug}"`;
      console.warn(msg);
      warnings.push(msg);
      failCount++;
      continue;
    }

    try {
      const html = fs.readFileSync(indexPath, "utf-8");
      const product = parseProduct(html, slug);

      if (product) {
        products.push(product);
        successCount++;

        const imageCount = product.images.length;
        const catCount = product.categories.length;
        const relCount = product.relatedProducts.length;
        console.log(
          `${progress} OK: "${product.title || slug}" - ${imageCount} images, ${catCount} categories, ${relCount} related`
        );

        if (!product.title) {
          warnings.push(`${progress} WARNING: No title found for "${slug}"`);
        }
        if (product.images.length === 0) {
          warnings.push(`${progress} WARNING: No images found for "${slug}"`);
        }
        if (!product.manufacturer) {
          warnings.push(
            `${progress} WARNING: No manufacturer found for "${slug}"`
          );
        }
      } else {
        const msg = `${progress} WARNING: Failed to parse product "${slug}"`;
        console.warn(msg);
        warnings.push(msg);
        failCount++;
      }
    } catch (err) {
      const msg = `${progress} ERROR: Exception parsing "${slug}": ${err instanceof Error ? err.message : String(err)}`;
      console.error(msg);
      warnings.push(msg);
      failCount++;
    }
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), "utf-8");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("PARSING COMPLETE");
  console.log("=".repeat(60));
  console.log(`Total directories: ${productDirs.length}`);
  console.log(`Successfully parsed: ${successCount}`);
  console.log(`Failed/skipped: ${failCount}`);
  console.log(`Output written to: ${OUTPUT_FILE}`);
  console.log(
    `Output file size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`
  );

  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`  ${w}`);
    }
  }

  // Quick stats
  const withTitle = products.filter((p) => p.title).length;
  const withDesc = products.filter((p) => p.description).length;
  const withImages = products.filter((p) => p.images.length > 0).length;
  const withManufacturer = products.filter((p) => p.manufacturer).length;
  const withModel = products.filter((p) => p.model).length;
  const withApps = products.filter((p) => p.applications.length > 0).length;
  const withRef = products.filter((p) => p.referenceNumber).length;
  const withSysIncludes = products.filter((p) => p.systemIncludes).length;
  const withCategories = products.filter((p) => p.categories.length > 0).length;
  const withRelated = products.filter(
    (p) => p.relatedProducts.length > 0
  ).length;
  const withYear = products.filter((p) => p.year !== null).length;
  const totalImages = products.reduce((sum, p) => sum + p.images.length, 0);

  console.log("\nField Coverage:");
  console.log(`  title:           ${withTitle}/${products.length}`);
  console.log(`  description:     ${withDesc}/${products.length}`);
  console.log(`  images:          ${withImages}/${products.length} (${totalImages} total images)`);
  console.log(`  manufacturer:    ${withManufacturer}/${products.length}`);
  console.log(`  model:           ${withModel}/${products.length}`);
  console.log(`  applications:    ${withApps}/${products.length}`);
  console.log(`  referenceNumber: ${withRef}/${products.length}`);
  console.log(`  systemIncludes:  ${withSysIncludes}/${products.length}`);
  console.log(`  categories:      ${withCategories}/${products.length}`);
  console.log(`  relatedProducts: ${withRelated}/${products.length}`);
  console.log(`  year:            ${withYear}/${products.length}`);
}

main();
