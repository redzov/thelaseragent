import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

const MIRROR_BASE = path.resolve(
  __dirname,
  "../../laseragent-mirror/www.thelaseragent.com"
);
const OUTPUT_DIR = path.resolve(__dirname, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "team.json");

interface TeamMember {
  name: string;
  title: string;
  photo: string | null;
  email: string | null;
  linkedIn: string | null;
}

function parseTeamPage(): TeamMember[] {
  const filePath = path.join(MIRROR_BASE, "meet-the-team/index.html");

  if (!fs.existsSync(filePath)) {
    console.error(`Team page not found at: ${filePath}`);
    return [];
  }

  console.log(`Reading team page: ${filePath}`);
  const html = fs.readFileSync(filePath, "utf-8");
  const $ = cheerio.load(html);

  const members: TeamMember[] = [];

  // Team members are organized in fl-col elements within fl-col-group-nested groups.
  // Each member column contains:
  // 1. fl-module-photo with team member image (has class "team-pictures" or contains img with alt/title)
  // 2. fl-module-heading with name (first h3)
  // 3. fl-module-heading with title (second h3)
  // 4. fl-module-pp-social-icons with social links

  // Find all column groups that contain team member data.
  // Team members appear in two layout types:
  // 1. fl-col-group-nested .fl-col (first row of 4 members)
  // 2. fl-col-group .fl-col (second row with additional members)
  // We search all fl-col elements and filter by presence of photo + 2 headings.
  const teamSection = $(".fl-builder-content-primary");
  const seenNames = new Set<string>();

  // Find leaf-level columns (those that don't contain nested column groups)
  // that have both a photo module and heading modules, indicating a team member.
  teamSection
    .find(".fl-col")
    .each((_, colEl) => {
      const $col = $(colEl);

      // Skip parent columns that contain nested column groups
      if ($col.find(".fl-col-group-nested").length > 0) {
        return;
      }

      // Only look at direct child modules within .fl-col-content
      const colContent = $col.children(".fl-col-content");
      const photoModule = colContent.children(".fl-module-photo");
      const headingModules = colContent.children(".fl-module-heading");

      if (photoModule.length === 0 || headingModules.length < 2) {
        return; // Skip non-team-member columns
      }

      // Extract photo URL from noscript img or data-lazy-src
      let photo: string | null = null;
      const imgEl = photoModule.find("img.fl-photo-img").first();
      const lazySrc = imgEl.attr("data-lazy-src");
      if (lazySrc && !lazySrc.startsWith("data:")) {
        photo = lazySrc;
      } else {
        const noscriptHtml = photoModule.find("noscript").html();
        if (noscriptHtml) {
          const $noscript = cheerio.load(noscriptHtml);
          photo = $noscript("img").attr("src") || null;
        }
      }

      // Extract name from first heading
      const nameFromHeading = headingModules
        .eq(0)
        .find(".fl-heading-text")
        .text()
        .trim();

      // Extract title from second heading
      const titleFromHeading = headingModules
        .eq(1)
        .find(".fl-heading-text")
        .text()
        .trim();

      // Extract social links only from direct child social modules
      let email: string | null = null;
      let linkedIn: string | null = null;

      colContent
        .children(".fl-module-pp-social-icons")
        .find(".pp-social-icon a")
        .each((__, linkEl) => {
          const href = $(linkEl).attr("href") || "";
          if (href.startsWith("mailto:")) {
            email = href.replace("mailto:", "");
          } else if (href.includes("linkedin.com")) {
            linkedIn = href;
          }
        });

      if (nameFromHeading && !seenNames.has(nameFromHeading)) {
        seenNames.add(nameFromHeading);
        members.push({
          name: nameFromHeading,
          title: titleFromHeading || "Team Member",
          photo,
          email,
          linkedIn,
        });
        console.log(
          `  Found team member: ${nameFromHeading} - ${titleFromHeading}`
        );
      }
    });

  return members;
}

function main() {
  console.log("=== Parsing Team Page ===\n");

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  const members = parseTeamPage();

  console.log(`\nTotal: ${members.length} team members`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(members, null, 2), "utf-8");
  console.log(`Output written to: ${OUTPUT_FILE}`);
}

main();
