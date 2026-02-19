import { CheckCircle, ShoppingBag, Phone } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import CartClearer from "./CartClearer";

export const metadata = {
  title: "Order Confirmed",
  description: "Your order has been successfully placed. Thank you for your purchase!",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <CartClearer />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[#5ABA47]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#5ABA47]" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Thank You for Your Order!
        </h1>

        <p className="text-[#c9c9c9] mb-2">
          Your order has been successfully placed and is being processed.
        </p>
        <p className="text-[#c9c9c9] mb-8">
          You will receive an email confirmation shortly with your order details
          and tracking information.
        </p>

        {/* Order Info Box */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold text-white mb-3">
            What Happens Next?
          </h2>
          <ul className="space-y-3 text-[#c9c9c9] text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#5ABA47] font-bold mt-0.5">1.</span>
              <span>
                You will receive an order confirmation email with a summary of
                your purchase.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#5ABA47] font-bold mt-0.5">2.</span>
              <span>
                Our team will prepare your laser equipment for shipment and
                perform quality checks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#5ABA47] font-bold mt-0.5">3.</span>
              <span>
                You will receive shipping and tracking details once your order is
                dispatched.
              </span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/laser-machines-for-sale" className="block">
            <Button variant="primary" size="lg" className="w-full">
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Button>
          </Link>

          <Link href="/contact-us" className="block">
            <Button variant="outline" size="md" className="w-full">
              <Phone className="w-5 h-5" />
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
