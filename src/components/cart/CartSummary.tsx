"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import type { CartItem } from "@/components/cart/CartProvider";

interface CartSummaryProps {
  items: CartItem[];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>

      {/* Line Items */}
      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div
            key={item.slug}
            className="flex justify-between text-sm text-[#c9c9c9]"
          >
            <span className="truncate mr-2">
              {item.title} x{item.quantity}
            </span>
            <span className="flex-shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#333] pt-4 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-[#c9c9c9]">
          <span>Subtotal</span>
          <span className="font-medium text-white">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-[#c9c9c9]">
          <span>Shipping</span>
          <span className="text-sm italic">Calculated at checkout</span>
        </div>

        {/* Total */}
        <div className="border-t border-[#333] pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">Total</span>
            <span className="text-xl font-bold text-[#2196F3]">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <Link href="/checkout" className="block">
          <Button variant="primary" size="lg" className="w-full">
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>

        <Link
          href="/laser-machines-for-sale"
          className="flex items-center justify-center gap-2 text-sm text-[#c9c9c9] hover:text-[#2196F3] transition-colors py-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
