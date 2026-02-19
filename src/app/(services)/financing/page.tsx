import type { Metadata } from "next";
import Link from "next/link";
import { getStaticPageBySlug } from "@/lib/static-pages";
import { SITE_NAME, PHONE_PRIMARY, PHONE_PRIMARY_TEL } from "@/lib/constants";
import sanitizeHtml from "sanitize-html";

const page = getStaticPageBySlug("financing");

export const metadata: Metadata = {
  title: page?.metaTitle || "Financing Options",
  description: page?.metaDescription || `${SITE_NAME} offers financing on many laser products and services.`,
  openGraph: {
    title: page?.metaTitle || `Financing Options | ${SITE_NAME}`,
    description: page?.metaDescription,
    images: page?.ogImage ? [{ url: page.ogImage }] : undefined,
  },
};

export default function FinancingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Financing Options</h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            We offer financing on many laser products and services. Let us help you find the right solution for your budget.
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
              <p>
                Looking to buy a used medical laser? We offer financing on many products and
                services. Fill out the form below and find out what we can do for you.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Interested in Financing?
          </h2>
          <p className="text-[#c9c9c9] mb-6">
            Call us at{" "}
            <a href={PHONE_PRIMARY_TEL} className="text-[#5ABA47] hover:underline">
              {PHONE_PRIMARY}
            </a>{" "}
            or contact us to discuss financing options for your laser equipment purchase.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#5ABA47] text-white px-8 py-3 rounded-[20px] font-medium hover:bg-[#348923] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
