import { Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import {
  PHONE_PRIMARY,
  PHONE_PRIMARY_TEL,
  SOCIAL_LINKS,
} from "@/lib/constants";

export default function TopBar() {
  return (
    <div className="hidden md:block bg-[#111] border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9">
          {/* Phone */}
          <a
            href={PHONE_PRIMARY_TEL}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>{PHONE_PRIMARY}</span>
          </a>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
