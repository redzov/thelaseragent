import type { Metadata } from "next";
import { getStaticPageBySlug } from "@/lib/static-pages";
import { SITE_NAME } from "@/lib/constants";
import sanitizeHtml from "sanitize-html";

const page = getStaticPageBySlug("terms-and-conditions");

export const metadata: Metadata = {
  title: page?.metaTitle || "Terms and Conditions",
  description: page?.metaDescription || `Terms and Conditions for ${SITE_NAME}. These terms outline the rules and regulations for the use of our website.`,
  openGraph: {
    title: page?.metaTitle || `Terms and Conditions | ${SITE_NAME}`,
    description: page?.metaDescription,
    images: page?.ogImage ? [{ url: page.ogImage }] : undefined,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Terms and Conditions</h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            These terms and conditions outline the rules and regulations for the use of our website.
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
              <h2>Welcome to The Laser Agent, Inc</h2>
              <p>
                These terms and conditions outline the rules and regulations for the use of The
                Laser Agent, Inc website.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
