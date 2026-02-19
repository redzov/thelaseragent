"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartItemRow from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity } = useCart();

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-7 h-7 text-[#5ABA47]" />
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-[#333] mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-3">
              Your cart is empty
            </h2>
            <p className="text-[#c9c9c9] mb-8 max-w-md mx-auto">
              Browse our selection of premium used laser machines and add items
              to your cart.
            </p>
            <Link href="/laser-machines-for-sale">
              <Button variant="primary" size="lg">
                <ArrowLeft className="w-5 h-5" />
                Browse Lasers
              </Button>
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItemRow
                  key={item.slug}
                  item={item}
                  onRemove={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary items={cartItems} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
