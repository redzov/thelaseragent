import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const MIRROR_BASE = path.resolve(
  __dirname,
  "../../laseragent-mirror/www.thelaseragent.com"
);
const OUTPUT_DIR = path.resolve(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "faq.json");

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  sectionTitle: string;
  items: FaqItem[];
}

function parseFaqPage(): FaqSection[] {
  const filePath = path.join(MIRROR_BASE, "laser-faqs/index.html");

  if (!fs.existsSync(filePath)) {
    console.error(`FAQ page not found at: ${filePath}`);
    return [];
  }

  console.log(`Reading FAQ page: ${filePath}`);
  const html = fs.readFileSync(filePath, "utf-8");
  const $ = cheerio.load(html);

  const sections: FaqSection[] = [];

  // The page has section headings (h2 with pp-primary-title) followed by FAQ modules.
  // There are two types of FAQ modules:
  // 1. uabb-faq-module (UABB FAQ) - used for "Buying" and "Selling" sections
  // 2. pp-accordion (PowerPack Accordion) - used for "Repair/Service" section

  // Strategy: walk through the fl-builder-content and find headings + FAQ blocks in order
  const contentArea = $(".fl-builder-content-primary");

  // Find all section headings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headings: { title: string; node: any }[] = [];
  contentArea.find("h2.heading-title .title-text.pp-primary-title").each((_, el) => {
    const title = $(el).text().trim();
    if (title) {
      headings.push({ title, node: el });
    }
  });

  console.log(`Found ${headings.length} section headings`);

  // Parse UABB FAQ modules (used for buying and selling sections)
  contentArea.find(".fl-module-uabb-faq").each((_, moduleEl) => {
    const items: FaqItem[] = [];

    $(moduleEl)
      .find(".uabb-faq-item")
      .each((__, itemEl) => {
        const question = $(itemEl)
          .find(".uabb-faq-question-label")
          .text()
          .trim();
        const answerEl = $(itemEl).find(".uabb-faq-content");
        const answer = answerEl.text().trim();

        if (question && answer) {
          items.push({ question, answer });
        }
      });

    if (items.length > 0) {
      // Find the closest preceding heading
      const moduleNode = moduleEl;
      let sectionTitle = "General";

      // Walk backwards through headings to find the one that precedes this module
      const allNodes = contentArea.find(".fl-module").toArray();
      const moduleIndex = allNodes.indexOf(moduleNode);

      for (let i = moduleIndex - 1; i >= 0; i--) {
        const heading = $(allNodes[i]).find(
          "h2.heading-title .title-text.pp-primary-title"
        );
        if (heading.length > 0) {
          sectionTitle = heading.text().trim();
          break;
        }
      }

      // Check if section already exists (avoid duplicates)
      const existingSection = sections.find(
        (s) => s.sectionTitle === sectionTitle
      );
      if (existingSection) {
        existingSection.items.push(...items);
      } else {
        sections.push({ sectionTitle, items });
      }
      console.log(
        `  Section "${sectionTitle}": ${items.length} FAQ items (uabb-faq)`
      );
    }
  });

  // Parse PowerPack Accordion modules (used for repair/service section)
  contentArea.find(".fl-module-pp-advanced-accordion").each((_, moduleEl) => {
    const items: FaqItem[] = [];

    $(moduleEl)
      .find(".pp-accordion-item")
      .each((__, itemEl) => {
        const question = $(itemEl)
          .find(".pp-accordion-button-label")
          .text()
          .trim();
        const answerEl = $(itemEl).find(".pp-accordion-content");
        const answer = answerEl.find("[itemprop='text']").text().trim() ||
          answerEl.text().trim();

        if (question && answer) {
          items.push({ question, answer });
        }
      });

    if (items.length > 0) {
      // Find the closest preceding heading
      const allNodes = contentArea.find(".fl-module").toArray();
      const moduleIndex = allNodes.indexOf(moduleEl);
      let sectionTitle = "General";

      for (let i = moduleIndex - 1; i >= 0; i--) {
        const heading = $(allNodes[i]).find(
          "h2.heading-title .title-text.pp-primary-title"
        );
        if (heading.length > 0) {
          sectionTitle = heading.text().trim();
          break;
        }
      }

      const existingSection = sections.find(
        (s) => s.sectionTitle === sectionTitle
      );
      if (existingSection) {
        existingSection.items.push(...items);
      } else {
        sections.push({ sectionTitle, items });
      }
      console.log(
        `  Section "${sectionTitle}": ${items.length} FAQ items (pp-accordion)`
      );
    }
  });

  return sections;
}

function main() {
  console.log("=== Parsing FAQ page ===\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  const sections = parseFaqPage();

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
  console.log(
    `\nTotal: ${sections.length} sections, ${totalItems} FAQ items`
  );

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sections, null, 2), "utf-8");
  console.log(`\nOutput written to: ${OUTPUT_FILE}`);
}

main();
