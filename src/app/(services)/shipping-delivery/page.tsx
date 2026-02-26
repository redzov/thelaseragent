import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { Package, Shield, Truck, Box, Globe, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description: `${SITE_NAME} offers free shipping and full insurance coverage on all laser equipment orders over $1,000.`,
  openGraph: {
    title: `Shipping & Delivery | ${SITE_NAME}`,
    description: `${SITE_NAME} offers free shipping and full insurance coverage on all laser equipment orders over $1,000.`,
  },
};

const benefits = [
  {
    icon: Package,
    title: "Free Shipping on Orders Over $1,000",
    description:
      "Enjoy complimentary shipping on any order above $1,000.",
  },
  {
    icon: Shield,
    title: "Fully Insured Delivery",
    description:
      "All orders over $1,000 are insured for safe transit. In the rare event of damage, we cover it.",
  },
  {
    icon: Truck,
    title: "Fast & Reliable Shipping",
    description:
      "We partner with trusted carriers to ensure timely and secure delivery.",
  },
  {
    icon: Box,
    title: "Expert Packaging",
    description:
      "Your equipment will be carefully packaged to prevent damage during transit.",
  },
  {
    icon: Globe,
    title: "Global Shipping",
    description:
      "We offer both domestic and international delivery, so no matter where you are, we've got you covered.",
  },
  {
    icon: MapPin,
    title: "Tracking Updates",
    description:
      "Stay updated with real-time tracking information from order to delivery.",
  },
];

const steps = [
  {
    number: 1,
    title: "Browse & Order",
    description: "Choose your laser equipment and place your order.",
  },
  {
    number: 2,
    title: "Free Shipping & Insurance",
    description: "Orders over $1,000 ship free and are fully insured.",
  },
  {
    number: 3,
    title: "Delivery",
    description: "Track your order and receive it safely at your location.",
  },
];

export default function ShippingDeliveryPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Shipping &amp; Delivery
          </h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            Free shipping and full insurance coverage on all laser equipment
            orders over $1,000.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#c9c9c9] text-lg leading-relaxed">
            At Phoenix Aesthetics, we offer free shipping and full insurance
            coverage on all laser equipment orders over $1,000. Our goal is to
            get your high-end equipment to you quickly and safely, with no
            hidden fees.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 flex flex-col items-start"
              >
                <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-[#2196F3]/10">
                  <benefit.icon className="w-6 h-6 text-[#2196F3]" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-[#c9c9c9] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-[#2196F3] text-white text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-[#c9c9c9] text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#c9c9c9] text-lg leading-relaxed">
            At Phoenix Aesthetics, we&apos;re committed to delivering your laser
            equipment with care and convenience. Order today and take advantage
            of our free shipping and insurance on all orders over $1,000!
          </p>
        </div>
      </section>
    </div>
  );
}
