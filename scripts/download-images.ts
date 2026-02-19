/**
 * download-images.ts
 *
 * Copies product and article images from the local mirror of
 * www.thelaseragent.com into the Next.js public/images/ directory.
 *
 * Usage:  npx tsx scripts/download-images.ts
 */

import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PROJECT_ROOT = path.resolve(__dirname, "..");
const MIRROR_ROOT = path.resolve(
  PROJECT_ROOT,
  "..",
  "laseragent-mirror",
  "www.thelaseragent.com"
);
const PUBLIC_IMAGES = path.join(PROJECT_ROOT, "public", "images");
const DATA_DIR = path.join(PROJECT_ROOT, "scripts", "data");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RawProduct {
  title: string;
  slug: string;
  images: string[];
  ogImage: string | null;
}

interface RawArticle {
  title: string;
  slug: string;
  featuredImage: string | null;
  ogImage: string | null;
  body: string;
}

interface CopyResult {
  copied: number;
  missing: number;
  skipped: number;
  missingFiles: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJSON<T>(filename: string): T {
  const filepath = path.join(DATA_DIR, filename);
  return JSON.parse(fs.readFileSync(filepath, "utf-8")) as T;
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Convert an image URL (absolute or relative) to a file path within the mirror.
 *
 * Handles patterns like:
 *   - https://www.thelaseragent.com/wp-content/uploads/2022/07/foo.jpg
 *   - /wp-content/uploads/2022/07/foo.jpg
 *   - ../../wp-content/uploads/2022/07/foo.jpg
 *   - https://spcdn.shortpixel.ai/.../www.thelaseragent.com/wp-content/uploads/...
 */
function urlToMirrorPath(url: string): string | null {
  if (!url) return null;

  let wpPath: string | null = null;

  // Extract the wp-content/uploads/... portion
  const wpContentMatch = url.match(/wp-content\/uploads\/(.+)/);
  if (wpContentMatch) {
    wpPath = wpContentMatch[1];
  }

  if (!wpPath) return null;

  // Clean up any query params or fragments
  wpPath = wpPath.split("?")[0].split("#")[0];

  const mirrorFile = path.join(
    MIRROR_ROOT,
    "wp-content",
    "uploads",
    wpPath
  );

  return mirrorFile;
}

/**
 * Copy a single file from the mirror to the destination directory.
 * Returns true if file was copied, false if source didn't exist.
 */
function copyFile(
  srcPath: string,
  destDir: string,
  destFilename?: string
): boolean {
  if (!fs.existsSync(srcPath)) return false;

  ensureDir(destDir);
  const filename = destFilename || path.basename(srcPath);
  const destPath = path.join(destDir, filename);

  // Skip if already copied
  if (fs.existsSync(destPath)) {
    const srcStat = fs.statSync(srcPath);
    const destStat = fs.statSync(destPath);
    if (srcStat.size === destStat.size) return true; // Already up to date
  }

  fs.copyFileSync(srcPath, destPath);
  return true;
}

// ---------------------------------------------------------------------------
// Copy functions
// ---------------------------------------------------------------------------

function copyProductImages(): CopyResult {
  console.log("\n--- Copying product images ---");
  const products = readJSON<RawProduct[]>("products.json");
  const result: CopyResult = { copied: 0, missing: 0, skipped: 0, missingFiles: [] };

  for (const product of products) {
    const destDir = path.join(PUBLIC_IMAGES, "products", product.slug);
    const allUrls = [...product.images];
    if (product.ogImage && !allUrls.includes(product.ogImage)) {
      allUrls.push(product.ogImage);
    }

    for (const url of allUrls) {
      const mirrorPath = urlToMirrorPath(url);
      if (!mirrorPath) {
        result.skipped++;
        continue;
      }

      if (copyFile(mirrorPath, destDir)) {
        result.copied++;
      } else {
        result.missing++;
        result.missingFiles.push(`[${product.slug}] ${mirrorPath}`);
      }
    }
  }

  console.log(
    `  Copied: ${result.copied} | Missing: ${result.missing} | Skipped: ${result.skipped}`
  );
  return result;
}

function copyArticleImages(): CopyResult {
  console.log("\n--- Copying article images ---");
  const articles = readJSON<RawArticle[]>("articles.json");
  const result: CopyResult = { copied: 0, missing: 0, skipped: 0, missingFiles: [] };

  for (const article of articles) {
    const destDir = path.join(PUBLIC_IMAGES, "articles", article.slug);
    const urls: string[] = [];

    if (article.featuredImage) urls.push(article.featuredImage);
    if (article.ogImage && article.ogImage !== article.featuredImage) {
      urls.push(article.ogImage);
    }

    // Extract image URLs from article body HTML
    const imgRegex = /(?:src|srcset)=["']([^"']+?)["']/g;
    let match;
    while ((match = imgRegex.exec(article.body)) !== null) {
      const imgUrl = match[1];
      // Only grab thelaseragent.com images, skip CDN variants (srcset duplicates)
      if (
        imgUrl.includes("thelaseragent.com/wp-content/uploads") &&
        !urls.includes(imgUrl)
      ) {
        urls.push(imgUrl);
      }
    }

    for (const url of urls) {
      const mirrorPath = urlToMirrorPath(url);
      if (!mirrorPath) {
        result.skipped++;
        continue;
      }

      if (copyFile(mirrorPath, destDir)) {
        result.copied++;
      } else {
        result.missing++;
        result.missingFiles.push(`[${article.slug}] ${mirrorPath}`);
      }
    }
  }

  console.log(
    `  Copied: ${result.copied} | Missing: ${result.missing} | Skipped: ${result.skipped}`
  );
  return result;
}

function copySiteImages(): CopyResult {
  console.log("\n--- Copying site images ---");
  const destDir = path.join(PUBLIC_IMAGES, "site");
  const result: CopyResult = { copied: 0, missing: 0, skipped: 0, missingFiles: [] };

  // Key site images to copy with their destination filenames
  const siteImages: { src: string; dest: string }[] = [
    {
      src: "wp-content/uploads/2022/06/Laser-New-Logo.png",
      dest: "logo.png",
    },
    {
      src: "wp-content/uploads/2022/07/Untitled-design-2022-07-04T112810.163.jpg",
      dest: "hero.jpg",
    },
    {
      src: "wp-content/uploads/2024/06/finalThelaseragent-banner-image.webp",
      dest: "hero-banner.webp",
    },
    {
      src: "wp-content/uploads/2022/06/White-Logo-Eax-Media-2025-v3.webp",
      dest: "footer-logo.webp",
    },
    {
      src: "wp-content/uploads/2024/02/image-9.png",
      dest: "og-image.png",
    },
  ];

  // Also try common favicon / icon variations
  const extraImages: { src: string; dest: string }[] = [
    {
      src: "wp-content/uploads/2022/06/cropped-Untitled-design-2022-06-25T152340.572-192x192.png",
      dest: "favicon-192.png",
    },
    {
      src: "wp-content/uploads/2022/06/cropped-Untitled-design-2022-06-25T152340.572-32x32.png",
      dest: "favicon-32.png",
    },
    {
      src: "wp-content/uploads/2022/06/cropped-Untitled-design-2022-06-25T152340.572-180x180.png",
      dest: "apple-touch-icon.png",
    },
  ];

  const allImages = [...siteImages, ...extraImages];

  for (const img of allImages) {
    const srcPath = path.join(MIRROR_ROOT, img.src);
    if (copyFile(srcPath, destDir, img.dest)) {
      result.copied++;
      console.log(`  Copied: ${img.dest}`);
    } else {
      result.missing++;
      result.missingFiles.push(srcPath);
      console.log(`  MISSING: ${img.src}`);
    }
  }

  return result;
}

function copyTeamImages(): CopyResult {
  console.log("\n--- Copying team member images ---");
  const team = readJSON<
    { name: string; photo: string | null }[]
  >("team.json");
  const destDir = path.join(PUBLIC_IMAGES, "team");
  const result: CopyResult = { copied: 0, missing: 0, skipped: 0, missingFiles: [] };

  for (const member of team) {
    if (!member.photo) continue;

    const mirrorPath = urlToMirrorPath(member.photo);
    if (!mirrorPath) {
      // ShortPixel CDN URL - try to extract the original path
      const origMatch = member.photo.match(
        /www\.thelaseragent\.com\/(wp-content\/uploads\/.+)/
      );
      if (origMatch) {
        const origPath = path.join(MIRROR_ROOT, origMatch[1]);
        if (copyFile(origPath, destDir)) {
          result.copied++;
          continue;
        }
      }
      result.skipped++;
      continue;
    }

    if (copyFile(mirrorPath, destDir)) {
      result.copied++;
    } else {
      result.missing++;
      result.missingFiles.push(`[${member.name}] ${mirrorPath}`);
    }
  }

  console.log(
    `  Copied: ${result.copied} | Missing: ${result.missing} | Skipped: ${result.skipped}`
  );
  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("=== Image Download Script ===");
  console.log(`Mirror root: ${MIRROR_ROOT}`);
  console.log(`Output root: ${PUBLIC_IMAGES}`);

  // Verify mirror exists
  if (!fs.existsSync(MIRROR_ROOT)) {
    console.error(
      `\nERROR: Mirror directory not found at:\n  ${MIRROR_ROOT}\n\n` +
        "Make sure the laseragent-mirror directory exists at the expected path."
    );
    process.exit(1);
  }

  // Ensure output directories
  ensureDir(path.join(PUBLIC_IMAGES, "products"));
  ensureDir(path.join(PUBLIC_IMAGES, "articles"));
  ensureDir(path.join(PUBLIC_IMAGES, "site"));
  ensureDir(path.join(PUBLIC_IMAGES, "team"));

  const results: CopyResult[] = [];

  results.push(copySiteImages());
  results.push(copyProductImages());
  results.push(copyArticleImages());
  results.push(copyTeamImages());

  // Summary
  const totals = results.reduce(
    (acc, r) => ({
      copied: acc.copied + r.copied,
      missing: acc.missing + r.missing,
      skipped: acc.skipped + r.skipped,
      missingFiles: [...acc.missingFiles, ...r.missingFiles],
    }),
    { copied: 0, missing: 0, skipped: 0, missingFiles: [] as string[] }
  );

  console.log("\n=== Summary ===");
  console.log(`Total copied:  ${totals.copied}`);
  console.log(`Total missing: ${totals.missing}`);
  console.log(`Total skipped: ${totals.skipped}`);

  if (totals.missingFiles.length > 0 && totals.missingFiles.length <= 30) {
    console.log("\nMissing files:");
    for (const f of totals.missingFiles) {
      console.log(`  ${f}`);
    }
  } else if (totals.missingFiles.length > 30) {
    console.log(
      `\n${totals.missingFiles.length} files missing (showing first 30):`
    );
    for (const f of totals.missingFiles.slice(0, 30)) {
      console.log(`  ${f}`);
    }
  }

  console.log("\nDone!");
}

main();
