import { PrismaClient, CategoryType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const DATA_DIR = path.join(__dirname, "..", "scripts", "data");

// ---------------------------------------------------------------------------
// JSON type definitions (matching the parsed data files)
// ---------------------------------------------------------------------------

interface RawProduct {
  title: string;
  slug: string;
  description: string;
  descriptionHtml: string;
  price: number;
  callForPrice: boolean;
  images: string[];
  manufacturer: string | null;
  model: string | null;
  applications: string[] | null;
  referenceNumber: string | null;
  systemIncludes: string | null;
  categories: string[];
  relatedProducts: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  sku: number | null;
  year: number | null;
}

interface RawCategory {
  slug: string;
  name: string;
  type: string;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  heroImage: string | null;
}

interface RawArticle {
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  featuredImage: string | null;
  author: string;
  publishedAt: string;
  modifiedAt: string;
  categories: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
}

interface RawBlogCategory {
  name: string;
  slug: string;
}

interface RawFaqSection {
  sectionTitle: string;
  items: { question: string; answer: string }[];
}

interface RawTeamMember {
  name: string;
  title: string;
  photo: string | null;
  email: string | null;
  linkedIn: string | null;
}

interface RawReviewsFile {
  businessName: string;
  overallRating: number;
  totalReviews: string;
  reviews: {
    authorName: string;
    rating: number;
    text: string;
    date: string;
    timestamp: number;
    profileUrl: string;
    avatarUrl: string;
  }[];
}

interface RawStaticPage {
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  bodyHtml: string;
  bodyText: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJSON<T>(filename: string): T {
  const filepath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(raw) as T;
}

/**
 * Build a map from product-category display names (as they appear in
 * products.json "categories" arrays) to the category slug from categories.json.
 *
 * The product data uses simplified/title-cased names like "Alma Lasers",
 * "Yag Lasers For Sale", etc. We normalise both sides to lowercase-slug form
 * for matching, with manual overrides for the handful that don't match.
 */
function buildCategoryNameToSlugMap(
  categories: RawCategory[]
): Map<string, string> {
  const map = new Map<string, string>();

  // Manual overrides for names that don't normalise cleanly
  const overrides: Record<string, string> = {
    "Accessories": "other-cosmetic-lasers",
    "Cosmetic Laser Accessories": "other-cosmetic-lasers",
    "Used Laser Hair Removal Machines": "aesthetic-lasers-for-sale",
  };

  // Build a lookup from normalised slug -> actual slug
  const normalisedLookup = new Map<string, string>();
  for (const cat of categories) {
    normalisedLookup.set(cat.slug, cat.slug);
    // Also index by a slugified version of the name
    const nameSlug = cat.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    normalisedLookup.set(nameSlug, cat.slug);
  }

  // For each unique product category name, try to find its category slug
  return new Proxy(map, {
    get(target, prop) {
      if (prop === "get") {
        return (catName: string): string | undefined => {
          if (target.has(catName)) return target.get(catName);

          // Check manual overrides
          if (overrides[catName]) {
            target.set(catName, overrides[catName]);
            return overrides[catName];
          }

          // Try slugifying the product category name
          const nameSlug = catName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          // Direct slug match
          if (normalisedLookup.has(nameSlug)) {
            const slug = normalisedLookup.get(nameSlug)!;
            target.set(catName, slug);
            return slug;
          }

          // Try removing "for-sale" suffix
          const withoutForSale = nameSlug.replace(/-for-sale$/, "");
          if (normalisedLookup.has(withoutForSale)) {
            const slug = normalisedLookup.get(withoutForSale)!;
            target.set(catName, slug);
            return slug;
          }

          // Try adding "-lasers" suffix
          if (normalisedLookup.has(withoutForSale + "-lasers")) {
            const slug = normalisedLookup.get(withoutForSale + "-lasers")!;
            target.set(catName, slug);
            return slug;
          }

          // Try with "-for-sale" suffix
          if (normalisedLookup.has(nameSlug + "-for-sale")) {
            const slug = normalisedLookup.get(nameSlug + "-for-sale")!;
            target.set(catName, slug);
            return slug;
          }

          // Try adding "-lasers-for-sale" suffix
          const base = nameSlug.replace(/-lasers$/, "");
          if (normalisedLookup.has(base + "-lasers")) {
            const slug = normalisedLookup.get(base + "-lasers")!;
            target.set(catName, slug);
            return slug;
          }

          return undefined;
        };
      }
      return Reflect.get(target, prop);
    },
  });
}

// ---------------------------------------------------------------------------
// Simpler, direct category name-to-slug resolver
// ---------------------------------------------------------------------------

function resolveCategorySlug(
  catName: string,
  slugsByNorm: Map<string, string>
): string | undefined {
  // Manual overrides
  const overrides: Record<string, string> = {
    Accessories: "other-cosmetic-lasers",
    "Cosmetic Laser Accessories": "other-cosmetic-lasers",
    "Used Laser Hair Removal Machines": "aesthetic-lasers-for-sale",
  };

  if (overrides[catName]) return overrides[catName];

  const norm = catName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Direct match
  if (slugsByNorm.has(norm)) return slugsByNorm.get(norm)!;

  // Try adding "-for-sale"
  if (slugsByNorm.has(norm + "-for-sale")) return slugsByNorm.get(norm + "-for-sale")!;

  // Try removing "-for-sale"
  const noSale = norm.replace(/-for-sale$/, "");
  if (slugsByNorm.has(noSale)) return slugsByNorm.get(noSale)!;

  // "cutera-lasers-for-sale" -> "cutera-lasers"
  if (slugsByNorm.has(noSale.replace(/-lasers$/, "") + "-lasers"))
    return slugsByNorm.get(noSale.replace(/-lasers$/, "") + "-lasers")!;

  // "lutronic-lasers-for-sale" -> "lutronic-lasers"
  const baseName = norm.replace(/-lasers-for-sale$/, "-lasers");
  if (slugsByNorm.has(baseName)) return slugsByNorm.get(baseName)!;

  return undefined;
}

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

async function clearDatabase() {
  console.log("Clearing existing data...");

  // Delete in reverse dependency order
  await prisma.articleCategory.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productRelation.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.formSubmission.deleteMany();
  await prisma.review.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.staticPage.deleteMany();
  await prisma.article.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("  All tables cleared.");
}

async function seedCategories(): Promise<Map<string, number>> {
  console.log("Seeding categories...");
  const raw = readJSON<RawCategory[]>("categories.json");
  const slugToId = new Map<string, number>();

  for (let i = 0; i < raw.length; i++) {
    const cat = raw[i];
    const created = await prisma.category.create({
      data: {
        slug: cat.slug,
        name: cat.name,
        type: cat.type as CategoryType,
        description: cat.description || null,
        metaTitle: cat.metaTitle || null,
        metaDescription: cat.metaDescription || null,
        heroImage: cat.heroImage || null,
        sortOrder: i,
      },
    });
    slugToId.set(created.slug, created.id);
  }

  console.log(`  Seeded ${raw.length} categories.`);
  return slugToId;
}

async function seedProducts(): Promise<Map<string, number>> {
  console.log("Seeding products...");
  const raw = readJSON<RawProduct[]>("products.json");
  const slugToId = new Map<string, number>();

  for (let i = 0; i < raw.length; i++) {
    const p = raw[i];
    const created = await prisma.product.create({
      data: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        longDescription: p.descriptionHtml || null,
        price: new Decimal(p.price || 0),
        callForPrice: p.callForPrice ?? true,
        sku: p.sku != null ? String(p.sku) : null,
        referenceNumber: p.referenceNumber || null,
        manufacturer: p.manufacturer || null,
        model: p.model || null,
        year: p.year || null,
        applications: Array.isArray(p.applications)
          ? p.applications.join(", ")
          : p.applications || null,
        systemIncludes: p.systemIncludes || null,
        metaTitle: p.metaTitle || null,
        metaDescription: p.metaDescription || null,
        ogImage: p.ogImage || null,
        sortOrder: i,
        status: "ACTIVE",
        featured: false,
        isDeal: false,
      },
    });
    slugToId.set(created.slug, created.id);
  }

  console.log(`  Seeded ${raw.length} products.`);
  return slugToId;
}

async function seedProductImages(productSlugToId: Map<string, number>) {
  console.log("Seeding product images...");
  const raw = readJSON<RawProduct[]>("products.json");
  let count = 0;

  for (const p of raw) {
    const productId = productSlugToId.get(p.slug);
    if (!productId) continue;

    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId,
          url: p.images[i],
          alt: `${p.title} - image ${i + 1}`,
          sortOrder: i,
          isPrimary: i === 0,
        },
      });
      count++;
    }
  }

  console.log(`  Seeded ${count} product images.`);
}

async function seedProductCategories(
  productSlugToId: Map<string, number>,
  categorySlugToId: Map<string, number>
) {
  console.log("Seeding product categories...");
  const raw = readJSON<RawProduct[]>("products.json");
  const categories = readJSON<RawCategory[]>("categories.json");

  // Build normalised lookup: normalised-slug -> actual-slug
  const slugsByNorm = new Map<string, string>();
  for (const cat of categories) {
    slugsByNorm.set(cat.slug, cat.slug);
    // Also index by normalised form of the category name
    const normName = cat.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    slugsByNorm.set(normName, cat.slug);
  }

  let count = 0;
  const unmatchedCategories = new Set<string>();

  for (const p of raw) {
    const productId = productSlugToId.get(p.slug);
    if (!productId) continue;

    for (const catName of p.categories) {
      const catSlug = resolveCategorySlug(catName, slugsByNorm);
      if (!catSlug) {
        unmatchedCategories.add(catName);
        continue;
      }

      const categoryId = categorySlugToId.get(catSlug);
      if (!categoryId) {
        unmatchedCategories.add(catName);
        continue;
      }

      try {
        await prisma.productCategory.create({
          data: { productId, categoryId },
        });
        count++;
      } catch {
        // Duplicate - skip silently
      }
    }
  }

  if (unmatchedCategories.size > 0) {
    console.log(
      `  WARNING: Could not match these product categories: ${[...unmatchedCategories].join(", ")}`
    );
  }
  console.log(`  Seeded ${count} product-category links.`);
}

async function seedProductRelations(productSlugToId: Map<string, number>) {
  console.log("Seeding product relations...");
  const raw = readJSON<RawProduct[]>("products.json");
  let count = 0;

  for (const p of raw) {
    const fromId = productSlugToId.get(p.slug);
    if (!fromId || !p.relatedProducts) continue;

    for (const relSlug of p.relatedProducts) {
      const toId = productSlugToId.get(relSlug);
      if (!toId || fromId === toId) continue;

      try {
        await prisma.productRelation.create({
          data: { fromProductId: fromId, toProductId: toId },
        });
        count++;
      } catch {
        // Duplicate relation - skip
      }
    }
  }

  console.log(`  Seeded ${count} product relations.`);
}

async function seedBlogCategories(): Promise<Map<string, number>> {
  console.log("Seeding blog categories...");
  const raw = readJSON<RawBlogCategory[]>("blog-categories.json");
  const slugToId = new Map<string, number>();

  for (const bc of raw) {
    const created = await prisma.blogCategory.create({
      data: {
        slug: bc.slug,
        name: bc.name,
      },
    });
    slugToId.set(created.slug, created.id);
    // Also map by name for article-category matching
    slugToId.set(bc.name, created.id);
  }

  console.log(`  Seeded ${raw.length} blog categories.`);
  return slugToId;
}

async function seedArticles(): Promise<Map<string, number>> {
  console.log("Seeding articles...");
  const raw = readJSON<RawArticle[]>("articles.json");
  const slugToId = new Map<string, number>();

  for (const a of raw) {
    const created = await prisma.article.create({
      data: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt || null,
        body: a.body,
        featuredImage: a.featuredImage || null,
        author: a.author || "The Laser Agent",
        publishedAt: new Date(a.publishedAt),
        metaTitle: a.metaTitle || null,
        metaDescription: a.metaDescription || null,
        ogImage: a.ogImage || null,
      },
    });
    slugToId.set(created.slug, created.id);
  }

  console.log(`  Seeded ${raw.length} articles.`);
  return slugToId;
}

async function seedArticleCategories(
  articleSlugToId: Map<string, number>,
  blogCategoryMap: Map<string, number>
) {
  console.log("Seeding article categories...");
  const raw = readJSON<RawArticle[]>("articles.json");
  let count = 0;

  for (const a of raw) {
    const articleId = articleSlugToId.get(a.slug);
    if (!articleId) continue;

    for (const catName of a.categories) {
      // Article categories use names; some have HTML entities like &amp;
      const decodedName = catName.replace(/&amp;/g, "&");
      const blogCategoryId =
        blogCategoryMap.get(decodedName) || blogCategoryMap.get(catName);

      if (!blogCategoryId) {
        console.log(
          `  WARNING: Could not match blog category "${catName}" for article "${a.slug}"`
        );
        continue;
      }

      try {
        await prisma.articleCategory.create({
          data: { articleId, blogCategoryId },
        });
        count++;
      } catch {
        // Duplicate - skip
      }
    }
  }

  console.log(`  Seeded ${count} article-category links.`);
}

async function seedFaqItems() {
  console.log("Seeding FAQ items...");
  const raw = readJSON<RawFaqSection[]>("faq.json");
  let count = 0;
  let globalOrder = 0;

  for (const section of raw) {
    for (const item of section.items) {
      await prisma.faqItem.create({
        data: {
          question: item.question,
          answer: item.answer,
          section: section.sectionTitle,
          sortOrder: globalOrder++,
        },
      });
      count++;
    }
  }

  console.log(`  Seeded ${count} FAQ items.`);
}

async function seedTeamMembers() {
  console.log("Seeding team members...");
  const raw = readJSON<RawTeamMember[]>("team.json");

  for (let i = 0; i < raw.length; i++) {
    const m = raw[i];
    await prisma.teamMember.create({
      data: {
        name: m.name,
        title: m.title,
        photo: m.photo || null,
        bio: null,
        sortOrder: i,
      },
    });
  }

  console.log(`  Seeded ${raw.length} team members.`);
}

async function seedReviews() {
  console.log("Seeding reviews...");
  const raw = readJSON<RawReviewsFile>("reviews.json");

  for (let i = 0; i < raw.reviews.length; i++) {
    const r = raw.reviews[i];
    await prisma.review.create({
      data: {
        authorName: r.authorName,
        authorImage: r.avatarUrl || null,
        rating: r.rating,
        text: r.text,
        source: "google",
        reviewDate: r.timestamp
          ? new Date(r.timestamp * 1000)
          : null,
        sortOrder: i,
      },
    });
  }

  console.log(`  Seeded ${raw.reviews.length} reviews.`);
}

async function seedStaticPages() {
  console.log("Seeding static pages...");
  const raw = readJSON<RawStaticPage[]>("static-pages.json");

  for (const page of raw) {
    await prisma.staticPage.create({
      data: {
        slug: page.slug,
        title: page.title,
        body: page.bodyHtml || page.bodyText,
        metaTitle: page.metaTitle || null,
        metaDescription: page.metaDescription || null,
      },
    });
  }

  console.log(`  Seeded ${raw.length} static pages.`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Starting database seed ===\n");

  await clearDatabase();
  console.log("");

  // 1. Categories (no dependencies)
  const categorySlugToId = await seedCategories();

  // 2. Products (no dependencies)
  const productSlugToId = await seedProducts();

  // 3. Product images (depends on products)
  await seedProductImages(productSlugToId);

  // 4. Product-category links (depends on products + categories)
  await seedProductCategories(productSlugToId, categorySlugToId);

  // 5. Product relations (depends on products)
  await seedProductRelations(productSlugToId);

  // 6. Blog categories (no dependencies)
  const blogCategoryMap = await seedBlogCategories();

  // 7. Articles (no dependencies)
  const articleSlugToId = await seedArticles();

  // 8. Article-category links (depends on articles + blog categories)
  await seedArticleCategories(articleSlugToId, blogCategoryMap);

  // 9. FAQ items (no dependencies)
  await seedFaqItems();

  // 10. Team members (no dependencies)
  await seedTeamMembers();

  // 11. Reviews (no dependencies)
  await seedReviews();

  // 12. Static pages (no dependencies)
  await seedStaticPages();

  console.log("\n=== Seed complete! ===");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
