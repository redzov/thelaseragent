import type { Metadata } from "next";
import { getStaticPageBySlug } from "@/lib/static-pages";
import { SITE_NAME } from "@/lib/constants";
import sanitizeHtml from "sanitize-html";

const page = getStaticPageBySlug("shipping-delivery");

export const metadata: Metadata = {
  title: page?.metaTitle || "Shipping & Delivery",
  description: page?.metaDescription || `${SITE_NAME} takes pride in the level of service we provide when shipping and delivering lasers.`,
  openGraph: {
    title: page?.metaTitle || `Shipping & Delivery | ${SITE_NAME}`,
    description: page?.metaDescription,
    images: page?.ogImage ? [{ url: page.ogImage }] : undefined,
  },
};

export default function ShippingDeliveryPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Shipping &amp; Delivery</h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            We take pride in the level of service we provide when shipping and delivering lasers.
            Every precaution will be taken to protect your investment.
          </p>
        </div>
      </section>

      {/* Body Content */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {page?.bodyHtml ? (
            <div
              className="prose-dark"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(page.bodyHtml, {
                  allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3", "img"]),
                  allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    img: ["src", "alt", "width", "height"],
                  },
                }),
              }}
            />
          ) : (
            <div className="prose-dark">
              <h2>Logistics and Crating</h2>
              <p>
                We offer efficient laser machine shipping and delivery solutions. Our white glove
                delivery service uses our custom-built Ford Transit that we strap in securely with
                foam to ensure safety during transportation.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
