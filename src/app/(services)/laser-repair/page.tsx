import type { Metadata } from "next";
import Link from "next/link";
import { getStaticPageBySlug } from "@/lib/static-pages";
import { SITE_NAME, PHONE_PRIMARY, PHONE_PRIMARY_TEL } from "@/lib/constants";
import sanitizeHtml from "sanitize-html";

const page = getStaticPageBySlug("laser-repair");

export const metadata: Metadata = {
  title: page?.metaTitle || "Laser Repair & Service",
  description: page?.metaDescription || `${SITE_NAME} offers cosmetic and medical laser repair and service from major manufacturers.`,
  openGraph: {
    title: page?.metaTitle || `Laser Repair & Service | ${SITE_NAME}`,
    description: page?.metaDescription,
    images: page?.ogImage ? [{ url: page.ogImage }] : undefined,
  },
};

export default function LaserRepairPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Laser Repair &amp; Service
          </h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            Expert cosmetic and medical laser repair, preventative maintenance, and servicing for all major manufacturers.
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
              <h2>Our Laser Repair Service for All Types of Laser Machines</h2>
              <p>
                The Laser Agent offers cosmetic and medical laser repair service from major
                manufacturers. We offer preventative maintenance, parts, repairs, refurbishment,
                alignment, calibration and optics.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Need Your Laser Serviced?
          </h2>
          <p className="text-[#c9c9c9] mb-6">
            Call us at{" "}
            <a href={PHONE_PRIMARY_TEL} className="text-[#5ABA47] hover:underline">
              {PHONE_PRIMARY}
            </a>{" "}
            or reach out through our contact form to discuss your repair needs.
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
