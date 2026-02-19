import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { SITE_NAME } from "@/lib/constants";
import Accordion from "@/components/ui/Accordion";

interface FaqSection {
  sectionTitle: string;
  items: { question: string; answer: string }[];
}

function loadFaqs(): FaqSection[] {
  const filePath = path.join(process.cwd(), "scripts", "data", "faq.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as FaqSection[];
}

export const metadata: Metadata = {
  title: "Laser FAQs",
  description: `Frequently asked questions about buying, selling, and servicing used cosmetic and medical laser equipment from ${SITE_NAME}.`,
  openGraph: {
    title: `Laser FAQs | ${SITE_NAME}`,
    description: "Answers to common questions about buying, selling, and servicing used laser equipment.",
  },
};

export default function LaserFaqsPage() {
  const faqSections = loadFaqs();

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            Find answers to common questions about buying, selling, and servicing used laser equipment.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {faqSections.map((section) => (
            <Accordion
              key={section.sectionTitle}
              section={section.sectionTitle}
              items={section.items}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
