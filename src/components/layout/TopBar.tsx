import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";

export default function TopBar() {
  const hasSocials = SOCIAL_LINKS.facebook || SOCIAL_LINKS.instagram || SOCIAL_LINKS.twitter || SOCIAL_LINKS.linkedin;

  if (!hasSocials) return null;

  return (
    <div className="hidden md:block bg-[#111] border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-9">
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.facebook && (
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            )}
            {SOCIAL_LINKS.instagram && (
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}
            {SOCIAL_LINKS.twitter && (
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            )}
            {SOCIAL_LINKS.linkedin && (
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
