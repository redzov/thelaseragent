"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";

export default function CartClearer() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
