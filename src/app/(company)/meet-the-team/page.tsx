import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { SITE_NAME } from "@/lib/constants";
import TeamCarousel from "@/components/ui/TeamCarousel";

interface TeamMember {
  name: string;
  title: string;
  photo?: string | null;
  email?: string | null;
  linkedIn?: string | null;
}

function loadTeam(): TeamMember[] {
  const filePath = path.join(process.cwd(), "scripts", "data", "team.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as TeamMember[];
}

export const metadata: Metadata = {
  title: "Meet The Team",
  description: `Meet the team behind ${SITE_NAME}. Our dedicated staff is here to help you buy, sell, and service your laser equipment.`,
  openGraph: {
    title: `Meet The Team | ${SITE_NAME}`,
    description: `Meet the team behind ${SITE_NAME}. Our dedicated staff is here to help you with all your laser needs.`,
  },
};

export default function MeetTheTeamPage() {
  const team = loadTeam();

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Meet The Team</h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            Our dedicated team is committed to providing exceptional service for all your laser equipment needs.
          </p>
        </div>
      </section>

      {/* Team Carousel */}
      <section className="py-16 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <TeamCarousel members={team} />
        </div>
      </section>
    </div>
  );
}
