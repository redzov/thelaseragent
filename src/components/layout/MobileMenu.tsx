"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { MAIN_NAV, SOCIAL_LINKS, isNavGroup } from "@/lib/constants";
import type { NavItem, NavGroup } from "@/lib/constants";

function AccordionItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const allChildItems: NavItem[] = hasChildren
    ? item.children!.flatMap((child) =>
        isNavGroup(child as NavGroup)
          ? (child as NavGroup).items
          : [child as NavItem]
      )
    : [];

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className="block px-6 py-3 text-[15px] font-medium text-white hover:text-[#2196F3] border-b border-[#222] transition-colors"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-[#222]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-6 py-3 text-[15px] font-medium text-white hover:text-[#2196F3] transition-colors"
      >
        <span>{item.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0a0a0a] pb-2">
          {/* If it has groups (LASERS), show group headings */}
          {item.children!.length > 0 && isNavGroup(item.children![0] as NavGroup) ? (
            (item.children as NavGroup[]).map((group) => (
              <div key={group.group}>
                <p className="px-8 pt-3 pb-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  {group.group}
                </p>
                {group.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    onClick={onClose}
                    className="block px-10 py-2 text-sm text-gray-300 hover:text-[#2196F3] transition-colors"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            ))
          ) : (
            (item.children as NavItem[]).map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                onClick={onClose}
                className="block px-10 py-2 text-sm text-gray-300 hover:text-[#2196F3] transition-colors"
              >
                {subItem.label}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 hover:text-[#2196F3] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[320px] max-w-[85vw] bg-black z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222]">
          <span className="text-sm font-semibold text-white uppercase tracking-wider">
            Menu
          </span>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav Items */}
        <div className="overflow-y-auto h-[calc(100%-160px)]">
          {MAIN_NAV.map((item) => (
            <AccordionItem key={item.label} item={item} onClose={handleClose} />
          ))}
        </div>

        {/* Bottom: Social */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-[#222] bg-[#0a0a0a] px-6 py-4">
          <div className="flex items-center gap-4">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
