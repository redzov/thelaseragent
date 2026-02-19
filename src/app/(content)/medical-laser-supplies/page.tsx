import type { Metadata } from "next";
import Link from "next/link";
import { getStaticPageBySlug } from "@/lib/static-pages";
import { SITE_NAME } from "@/lib/constants";
import sanitizeHtml from "sanitize-html";

const page = getStaticPageBySlug("medical-laser-supplies");

export const metadata: Metadata = {
  title: page?.metaTitle || "Medical Laser Supplies",
  description: page?.metaDescription || `${SITE_NAME} carries a wide range of medical laser equipment supplies from major manufacturers.`,
  openGraph: {
    title: page?.metaTitle || `Medical Laser Supplies | ${SITE_NAME}`,
    description: page?.metaDescription,
    images: page?.ogImage ? [{ url: page.ogImage }] : undefined,
  },
};

export default function MedicalLaserSuppliesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Medical Laser Supplies
          </h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            We carry a wide range of refurbished laser machines and supplies from major manufacturers in the industry.
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
                    a: ["href", "target", "rel"],
                  },
                }),
              }}
            />
          ) : (
            <div className="prose-dark">
              <h2>Contact Us to View Our Laser Machines</h2>
              <p>
                As one of the largest worldwide resellers of medical lasers, The Laser Agent is
                here to help you find the perfect system for your specific application.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Need Laser Supplies?
          </h2>
          <p className="text-[#c9c9c9] mb-6">
            Contact us to view our inventory or request a live demonstration of any system we have in stock.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-[#5ABA47] text-white px-8 py-3 rounded-[20px] font-medium hover:bg-[#348923] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/laser-machines-for-sale"
              className="inline-block bg-transparent text-[#5ABA47] border-2 border-[#5ABA47] px-8 py-3 rounded-[20px] font-medium hover:bg-[#5ABA47] hover:text-white transition-colors"
            >
              Browse Lasers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
