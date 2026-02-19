export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(price: number): string {
  if (price === 0) return "Call for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + "...";
}

export function parseYear(title: string): number | null {
  const match = title.match(/^(\d{4})\s/);
  return match ? parseInt(match[1], 10) : null;
}

export function getImagePath(originalUrl: string): string {
  // Strip CDN prefix if present
  const cleaned = originalUrl
    .replace(/https?:\/\/spcdn\.shortpixel\.ai\/[^/]+\//, "")
    .replace(/https?:\/\/www\.thelaseragent\.com\//, "/images/");
  return cleaned;
}

export function getProductImagePath(slug: string, imageUrl: string): string {
  const filename = imageUrl.split("/").pop() || "image.jpg";
  return `/images/products/${slug}/${filename}`;
}

export function categoryNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+for\s+sale$/i, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}
