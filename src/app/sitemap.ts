import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/products";
import { getAllArticleSlugs } from "@/lib/articles";
import { SITE_URL } from "@/lib/constants";
import categoriesData from "../../scripts/data/categories.json";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/laser-machines-for-sale`,
      lastModified: new Date(),
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sell-a-laser`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/laser-repair`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/customer-reviews`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/meet-the-team`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/financing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-delivery`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/laser-faqs`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/customer-education`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/medical-laser-supplies`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/training`,
      lastModified: new Date(),
      changeFrequency: "monthly" as ChangeFrequency,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as ChangeFrequency,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly" as ChangeFrequency,
      priority: 0.3,
    },
  ];

  // Product pages
  const productSlugs = getAllProductSlugs();
  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as ChangeFrequency,
    priority: 0.8,
  }));

  // Article pages
  const articleSlugs = getAllArticleSlugs();
  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${baseUrl}/article/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.7,
  }));

  // Category / Brand pages (from categories.json)
  const categories = categoriesData as { slug: string; type: string }[];
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as ChangeFrequency,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...articlePages,
    ...categoryPages,
  ];
}
