"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, CreditCard } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems, totalItems } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && totalItems === 0 && !isLoading) {
      router.push("/cart");
    }
  }, [mounted, totalItems, isLoading, router]);

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503) {
          setError("Payment processing is currently being set up. Please contact us to complete your order.");
          setIsLoading(false);
          return;
        }
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setIsLoading(false);
    }
  }

  // Auto-initiate checkout when page loads with items
  useEffect(() => {
    if (mounted && totalItems > 0 && !isLoading && !error) {
      handleCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        {error ? (
          /* Error State */
          <div className="space-y-6">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Checkout Unavailable
            </h1>
            <p className="text-[#c9c9c9]">{error}</p>
            <div className="space-y-3">
              <Button
                variant="primary"
                size="md"
                onClick={handleCheckout}
                className="w-full"
              >
                <CreditCard className="w-5 h-5" />
                Try Again
              </Button>
              <Link href="/cart" className="block">
                <Button variant="outline" size="md" className="w-full">
                  Return to Cart
                </Button>
              </Link>
              <Link
                href="/contact-us"
                className="block text-sm text-[#5ABA47] hover:underline mt-2"
              >
                Contact us to complete your order
              </Link>
            </div>
          </div>
        ) : (
          /* Loading State */
          <div className="space-y-6">
            <Loader2 className="w-12 h-12 text-[#5ABA47] animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-white">
              Redirecting to Checkout
            </h1>
            <p className="text-[#c9c9c9]">
              Please wait while we set up your secure payment session...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
