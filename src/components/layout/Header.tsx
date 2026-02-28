"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import CartIcon from "@/components/cart/CartIcon";

function SearchButton() {
  return (
    <button
      className="p-2 text-white hover:text-[#2196F3] transition-colors"
      aria-label="Search"
    >
      <Search className="w-5 h-5" />
    </button>
  );
}

export default function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 bg-black border-b border-[#222] transition-shadow duration-200 ${
        hasScrolled ? "shadow-lg shadow-black/30" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[80px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/site/logo.png"
              alt="Phoenix Aesthetics"
              width={64}
              height={52}
              className="w-auto h-[52px]"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <MegaMenu />

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <SearchButton />
            <CartIcon />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
