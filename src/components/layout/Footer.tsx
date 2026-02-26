import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone } from "lucide-react";
import { SOCIAL_LINKS, SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6 text-sm text-[#555]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#2196F3]" />
            <span>28 Liberty St, New York, 10005</span>
          </div>
          <a href="tel:+13152809444" className="flex items-center gap-2 hover:text-[#2196F3] transition-colors">
            <Phone className="w-4 h-4 text-[#2196F3]" />
            <span>(315) 280-9444</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {SOCIAL_LINKS.facebook && (
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-[#757575] hover:bg-[#2196F3] hover:text-white transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>
          )}
          {SOCIAL_LINKS.instagram && (
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-[#757575] hover:bg-[#2196F3] hover:text-white transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          {SOCIAL_LINKS.twitter && (
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-[#757575] hover:bg-[#2196F3] hover:text-white transition-all"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
          {SOCIAL_LINKS.linkedin && (
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-[#757575] hover:bg-[#2196F3] hover:text-white transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#757575]">
            <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <Link
                href="/terms-and-conditions"
                className="hover:text-[#2196F3] transition-colors"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-[#2196F3] transition-colors"
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
