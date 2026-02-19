"use client";

import { useState } from "react";
import { Phone, DollarSign, ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";
import { PHONE_PRIMARY_TEL, PHONE_PRIMARY } from "@/lib/constants";

interface ProductActionsProps {
  product: {
    slug: string;
    title: string;
    price: number;
    callForPrice: boolean;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [getPriceOpen, setGetPriceOpen] = useState(false);
  const [makeOfferOpen, setMakeOfferOpen] = useState(false);

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <div className="flex flex-col gap-3">
        {/* Add to Cart - only if real price */}
        {!product.callForPrice && product.price > 0 && (
          <Button variant="primary" size="lg" className="w-full">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>
        )}

        {/* Get Price */}
        <Button
          variant={product.callForPrice ? "primary" : "secondary"}
          size="lg"
          className="w-full"
          onClick={() => setGetPriceOpen(!getPriceOpen)}
        >
          <Phone className="w-5 h-5" />
          Get Price
        </Button>

        {/* Make Offer */}
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => setMakeOfferOpen(!makeOfferOpen)}
        >
          <DollarSign className="w-5 h-5" />
          Make an Offer
        </Button>

        {/* Call directly */}
        <a
          href={PHONE_PRIMARY_TEL}
          className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mt-2"
        >
          <Phone className="w-4 h-4" />
          Or call us directly: {PHONE_PRIMARY}
        </a>
      </div>

      {/* Get Price Modal Placeholder */}
      {getPriceOpen && (
        <div className="mt-4 p-4 bg-[#111] rounded-lg border border-[#333]">
          <h3 className="text-white font-medium mb-2">Get a Price Quote</h3>
          <p className="text-gray-400 text-sm mb-3">
            Interested in the {product.title}? Fill out the form below and
            we&apos;ll get back to you with pricing.
          </p>
          <p className="text-xs text-gray-500 italic">
            Full form coming soon. Call us at{" "}
            <a href={PHONE_PRIMARY_TEL} className="text-[#5ABA47]">
              {PHONE_PRIMARY}
            </a>{" "}
            for immediate pricing.
          </p>
        </div>
      )}

      {/* Make Offer Modal Placeholder */}
      {makeOfferOpen && (
        <div className="mt-4 p-4 bg-[#111] rounded-lg border border-[#333]">
          <h3 className="text-white font-medium mb-2">Make an Offer</h3>
          <p className="text-gray-400 text-sm mb-3">
            Want to make an offer on the {product.title}? Submit your best
            offer below.
          </p>
          <p className="text-xs text-gray-500 italic">
            Full form coming soon. Call us at{" "}
            <a href={PHONE_PRIMARY_TEL} className="text-[#5ABA47]">
              {PHONE_PRIMARY}
            </a>{" "}
            to negotiate directly.
          </p>
        </div>
      )}
    </div>
  );
}
