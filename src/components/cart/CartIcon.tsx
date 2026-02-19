"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function CartIcon() {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  // Hydration-safe: only show count after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCount = mounted ? totalItems : 0;

  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-300 hover:text-[#5ABA47] transition-colors"
      aria-label={`Shopping cart${displayCount > 0 ? `, ${displayCount} items` : ""}`}
    >
      <ShoppingCart className="w-5 h-5" />
      {displayCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#5ABA47] rounded-full leading-none">
          {displayCount > 99 ? "99+" : displayCount}
        </span>
      )}
    </Link>
  );
}
