import type { Metadata } from "next";
import { getStaticPageBySlug } from "@/lib/static-pages";
import { SITE_NAME } from "@/lib/constants";
import sanitizeHtml from "sanitize-html";

const page = getStaticPageBySlug("privacy-and-policy");

export const metadata: Metadata = {
  title: page?.metaTitle || "Privacy Policy",
  description: page?.metaDescription || `Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your personal information.`,
  openGraph: {
    title: page?.metaTitle || `Privacy Policy | ${SITE_NAME}`,
    description: page?.metaDescription,
    images: page?.ogImage ? [{ url: page.ogImage }] : undefined,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy outlines what we collect and how we use your personal information.
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
              <h2>Privacy Policy for Phoenix Aesthetics</h2>
              <p>
                Your privacy is important to us. This policy outlines what we collect, how we
                collect it, and how we use your personal information.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
