"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";

interface AddToCartButtonProps {
  product: {
    slug: string;
    title: string;
    price: number;
    image: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  if (product.price <= 0) return null;

  function handleAddToCart() {
    addItem({
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`w-full transition-all duration-300 ${
        isAdded
          ? "!bg-green-600 !border-green-600"
          : ""
      }`}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
