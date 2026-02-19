import Link from "next/link";
import { MapPin, Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { OFFICES, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Offices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {OFFICES.map((office) => (
            <div key={office.name} className="text-center md:text-left">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                {office.name}
              </h3>
              <div className="space-y-2">
                <a
                  href={office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-[#757575] hover:text-[#5ABA47] transition-colors justify-center md:justify-start"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{office.address}</span>
                </a>
                <a
                  href={office.phoneTel}
                  className="flex items-center gap-2 text-sm text-[#757575] hover:text-[#5ABA47] transition-colors justify-center md:justify-start"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{office.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-[#757575] hover:bg-[#5ABA47] hover:text-white transition-all"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-[#757575] hover:bg-[#5ABA47] hover:text-white transition-all"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-[#757575] hover:bg-[#5ABA47] hover:text-white transition-all"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-[#757575] hover:bg-[#5ABA47] hover:text-white transition-all"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#757575]">
            <p>&copy; 2025 The Laser Agent. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <Link
                href="/terms-and-conditions"
                className="hover:text-[#5ABA47] transition-colors"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-[#5ABA47] transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
