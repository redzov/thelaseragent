import type { Metadata } from "next";
import { getStaticPageBySlug } from "@/lib/static-pages";
import { SITE_NAME } from "@/lib/constants";

const page = getStaticPageBySlug("videos");

const VIDEO_IDS = [
  "F0-ea8Gbyuk",
  "G6vwmuAUaqw",
  "jhcdbFvJD3c",
  "qEDwKxntIlg",
  "TAWUGDHX-Vk",
  "DkoZmVyI8a4",
  "DxURcSfzUWQ",
  "550c33knnqo",
  "ee0DBvUDDDQ",
];

export const metadata: Metadata = {
  title: page?.metaTitle || "Videos",
  description: page?.metaDescription || `Videos from ${SITE_NAME} showcasing our equipment, office, and warehouse.`,
  openGraph: {
    title: page?.metaTitle || `Videos | ${SITE_NAME}`,
    description: page?.metaDescription,
    images: page?.ogImage ? [{ url: page.ogImage }] : undefined,
  },
};

export default function VideosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Videos</h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            Watch videos of our equipment, office, and warehouse. Schedule an appointment to view our inventory or request a demonstration.
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VIDEO_IDS.map((videoId) => (
              <div
                key={videoId}
                className="aspect-video rounded-lg overflow-hidden bg-[#1a1a1a] border border-[#333]"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title={`The Laser Agent Video ${videoId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
