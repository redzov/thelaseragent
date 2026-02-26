"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import type { CartItem as CartItemType } from "@/components/cart/CartProvider";

interface CartItemProps {
  item: CartItemType;
  onRemove: (slug: string) => void;
  onUpdateQuantity: (slug: string, quantity: number) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartItemRow({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
      {/* Product Image */}
      <Link
        href={`/laser-machines-for-sale/${item.slug}`}
        className="flex-shrink-0"
      >
        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-[#333]">
          <Image
            src={item.image || "/images/products/placeholder.jpg"}
            alt={item.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/laser-machines-for-sale/${item.slug}`}
          className="text-white font-medium hover:text-[#2196F3] transition-colors line-clamp-2 text-sm sm:text-base"
        >
          {item.title}
        </Link>
        <p className="text-[#2196F3] font-semibold mt-1">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.slug, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#333] text-gray-300 hover:bg-[#444] hover:text-white transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center text-white font-medium text-sm">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.slug, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#333] text-gray-300 hover:bg-[#444] hover:text-white transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Line Total */}
      <div className="text-right min-w-[80px]">
        <p className="text-white font-semibold">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.slug)}
        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
        aria-label={`Remove ${item.title} from cart`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
