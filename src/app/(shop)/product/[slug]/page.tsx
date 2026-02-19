import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import ProductActions from "@/components/product/ProductActions";
import RelatedProducts from "@/components/product/RelatedProducts";
import {
  getProductBySlug,
  getAllProductSlugs,
  getRelatedProducts,
} from "@/lib/products";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: `Product Not Found | ${SITE_NAME}`,
    };
  }

  const title = product.metaTitle || `${product.title} | ${SITE_NAME}`;
  const description =
    product.metaDescription ||
    product.description ||
    `Buy used ${product.title} from The Laser Agent.`;
  const ogImage = product.ogImage || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/product/${product.slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(slug);

  const galleryImages = product.images
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => ({
      url: img.url,
      alt: img.alt,
    }));

  return (
    <div>
      {/* Breadcrumbs */}
      <section className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              {
                label: "Laser Machines for Sale",
                href: "/laser-machines-for-sale",
              },
              { label: product.title },
            ]}
          />
        </div>
      </section>

      {/* Product Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Gallery */}
            <div>
              <ProductGallery images={galleryImages} />
            </div>

            {/* Right: Details + Actions */}
            <div>
              <ProductDetails product={product} />
              <div className="mt-8">
                <ProductActions
                  product={{
                    slug: product.slug,
                    title: product.title,
                    price: product.price,
                    callForPrice: product.callForPrice,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            image: product.images[0]?.url,
            sku: product.sku,
            brand: product.manufacturer
              ? {
                  "@type": "Brand",
                  name: product.manufacturer,
                }
              : undefined,
            offers: {
              "@type": "Offer",
              url: `${SITE_URL}/product/${product.slug}`,
              priceCurrency: "USD",
              price:
                product.callForPrice || product.price === 0
                  ? undefined
                  : product.price,
              availability:
                product.status === "SOLD"
                  ? "https://schema.org/SoldOut"
                  : "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: SITE_NAME,
              },
            },
          }),
        }}
      />
    </div>
  );
}
