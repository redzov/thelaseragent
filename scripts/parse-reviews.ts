import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const MIRROR_BASE = path.resolve(
  __dirname,
  "../../laseragent-mirror/www.thelaseragent.com"
);
const OUTPUT_DIR = path.resolve(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "reviews.json");

interface Review {
  authorName: string;
  rating: number;
  text: string;
  date: string;
  timestamp: number;
  profileUrl: string | null;
  avatarUrl: string | null;
}

interface ReviewsData {
  businessName: string;
  overallRating: number;
  totalReviews: string;
  reviews: Review[];
}

function parseReviews(): ReviewsData {
  const filePath = path.join(MIRROR_BASE, "index.html");

  if (!fs.existsSync(filePath)) {
    console.error(`Homepage not found at: ${filePath}`);
    return {
      businessName: "The Laser Agent",
      overallRating: 5.0,
      totalReviews: "0",
      reviews: [],
    };
  }

  console.log(`Reading homepage: ${filePath}`);
  const html = fs.readFileSync(filePath, "utf-8");
  const $ = cheerio.load(html);

  // The Google Reviews widget uses the class structure:
  // .wp-gr .grw-row -> .grw-header (overall info) + .grw-content (individual reviews)
  const widget = $(".wp-gr");

  // Parse header info
  const businessName =
    widget.find(".grw-header .wp-google-name a").first().text().trim() ||
    "The Laser Agent";

  const overallRatingText = widget
    .find(".grw-header .rpi-stars")
    .first()
    .css("--rating");
  const overallRating = overallRatingText ? parseFloat(overallRatingText) : 5.0;

  const totalReviews =
    widget.find(".wp-google-based").first().text().trim() || "Unknown";

  console.log(
    `Business: ${businessName}, Rating: ${overallRating}, ${totalReviews}`
  );

  // Parse individual reviews
  const reviews: Review[] = [];

  widget.find(".grw-review").each((_, reviewEl) => {
    const $review = $(reviewEl);

    // Author name from the .wp-google-name link
    const authorName = $review.find(".wp-google-name").text().trim();

    // Rating from --rating CSS variable on .rpi-stars
    const ratingStyle = $review.find(".rpi-stars").attr("style") || "";
    const ratingMatch = ratingStyle.match(/--rating:\s*(\d+)/);
    const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 5;

    // Review text
    const text = $review.find(".wp-google-text").text().trim();

    // Date from data-time attribute (unix timestamp) and displayed text
    const timeEl = $review.find(".wp-google-time");
    const timestamp = parseInt(timeEl.attr("data-time") || "0", 10);
    const date = timeEl.text().trim();

    // Profile URL
    const profileUrl =
      $review.find(".wp-google-name").attr("href") || null;

    // Avatar URL - get from noscript img or data-lazy-src
    let avatarUrl: string | null = null;
    const imgEl = $review.find(".grw-img-wrap img").first();
    const lazySrc = imgEl.attr("data-lazy-src");
    if (lazySrc && !lazySrc.startsWith("data:")) {
      avatarUrl = lazySrc;
    } else {
      // Try noscript version
      const noscriptImg = $review.find(".grw-img-wrap noscript img");
      if (noscriptImg.length > 0) {
        avatarUrl = noscriptImg.attr("src") || null;
      }
    }

    if (authorName) {
      reviews.push({
        authorName,
        rating,
        text,
        date,
        timestamp,
        profileUrl,
        avatarUrl,
      });
    }
  });

  console.log(`Found ${reviews.length} reviews`);

  return { businessName, overallRating, totalReviews, reviews };
}

function main() {
  console.log("=== Parsing Google Reviews ===\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  const data = parseReviews();

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), "utf-8");
  console.log(`\nOutput written to: ${OUTPUT_FILE}`);
}

main();
