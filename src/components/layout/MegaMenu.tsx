"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { MAIN_NAV, isNavGroup } from "@/lib/constants";
import type { NavItem, NavGroup } from "@/lib/constants";

function NavGroupDropdown({ children }: { children: NavGroup[] }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-6 min-w-[500px]">
        <div className="grid grid-cols-2 gap-8">
          {children.map((group) => (
            <div key={group.group}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {group.group}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block px-2 py-1.5 text-sm text-gray-700 hover:text-[#2196F3] hover:bg-gray-50 rounded transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavItemDropdown({ children }: { children: NavItem[] }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[220px] max-h-[70vh] overflow-y-auto">
        {children.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2196F3] hover:bg-gray-50 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function NavMenuItem({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasChildren = item.children && item.children.length > 0;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`
          flex items-center gap-1 px-3 py-2 text-[13px] font-medium uppercase tracking-wide
          text-gray-700 hover:text-[#2196F3] transition-colors whitespace-nowrap
          ${isOpen ? "text-[#2196F3]" : ""}
        `}
        onClick={(e) => {
          if (item.href === "#") e.preventDefault();
        }}
      >
        {item.label}
        {hasChildren && (
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </Link>

      {hasChildren && isOpen && (
        <>
          {item.children!.length > 0 && isNavGroup(item.children![0] as NavGroup) ? (
            <NavGroupDropdown children={item.children as NavGroup[]} />
          ) : (
            <NavItemDropdown children={item.children as NavItem[]} />
          )}
        </>
      )}
    </div>
  );
}

export default function MegaMenu() {
  return (
    <nav className="hidden lg:flex items-center">
      {MAIN_NAV.map((item) => (
        <NavMenuItem key={item.label} item={item} />
      ))}
    </nav>
  );
}
