import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import SellLaserForm from "@/components/forms/SellLaserForm";

export const metadata: Metadata = {
  title: "Sell Your Laser",
  description: `Sell your used cosmetic or medical laser equipment to ${SITE_NAME}. We buy all major brands including Candela, Cynosure, Lumenis, and more. Get a fair price today.`,
  openGraph: {
    title: `Sell Your Laser | ${SITE_NAME}`,
    description: `Sell your used cosmetic or medical laser equipment to ${SITE_NAME}. Get a fair price today.`,
  },
};

export default function SellALaserPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Sell Your Laser</h1>
          <p className="text-[#c9c9c9] text-lg max-w-2xl mx-auto">
            Ready to sell your used cosmetic or medical laser? We purchase all major manufacturer
            brands and make the process simple.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-dark">
            <h2>How It Works</h2>
            <p>
              Selling your used laser equipment has never been easier. Simply fill out the form
              below with details about your system and we&apos;ll provide you with a competitive
              offer. We purchase all major aesthetic and cosmetic manufacturer brands including
              Candela, Cutera, Cynosure, Lumenis, Lutronic, Quanta, Alma, BTL, Syneron, Palomar,
              and more.
            </p>
            <p>
              We cover all transportation and liability costs, whether we pick up the system with
              our Ford Transit vans or coordinate crating and shipping. The price of your used laser
              is determined by the date of manufacturing, pulse counts, handpieces and accessories,
              and overall cosmetic condition.
            </p>
            <p>
              Have questions? Fill out the form below to get started or reach out through our contact page.
            </p>
          </div>
        </div>
      </section>

      {/* Sell Laser Form */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            Tell Us About Your Laser
          </h2>
          <p className="text-[#c9c9c9] text-center mb-8">
            Fill out the form and we&apos;ll contact you with a quote.
          </p>
          <SellLaserForm />
        </div>
      </section>
    </div>
  );
}
