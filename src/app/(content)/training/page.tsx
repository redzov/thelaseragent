import type { Metadata } from "next";
import Link from "next/link";
import { getStaticPageBySlug } from "@/lib/static-pages";
import { SITE_NAME } from "@/lib/constants";
import sanitizeHtml from "sanitize-html";

const page = getStaticPageBySlug("training");

export const metadata: Metadata = {
  title: page?.metaTitle || "Training",
  description: page?.metaDescription || `${SITE_NAME} offers a variety of training and certification opportunities for our customers.`,
  openGraph: {
    title: page?.metaTitle || `Training | ${SITE_NAME}`,
    description: page?.metaDescription,
    images: page?.ogImage ? [{ url: page.ogImage }] : undefined,
  },
};

export default function TrainingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Training</h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            We offer a variety of training and certification opportunities on most major laser manufacturers.
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
              <h2>Cosmetic Laser Training</h2>
              <p>
                The Laser Agent offers a variety of training and certification opportunities for
                our customers. We offer training courses on most major manufacturers.
              </p>
              <h2>Training Topics</h2>
              <p>
                Training can also be scheduled by treatment type or indication. Interested in
                scheduling your training? Contact us today.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Schedule Training?
          </h2>
          <p className="text-[#c9c9c9] mb-6">
            Contact us today to schedule a training session for your team.
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
