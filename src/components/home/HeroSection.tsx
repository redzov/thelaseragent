import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/site/hero.jpg)" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Dual heading: white + green */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          <span className="text-white">The Industry Leader in </span>
          <span className="text-[#2196F3]">
            Used Cosmetic, Medical and Aesthetic Lasers For Sale
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-[#c9c9c9] max-w-2xl mx-auto mb-10 leading-relaxed">
          The #1 Source For Used Cosmetic, Aesthetic &amp; Medical Laser
          Equipment
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/laser-machines-for-sale">
            <Button size="lg">Buy a Laser</Button>
          </Link>
          <Link href="/sell-a-laser">
            <Button variant="secondary" size="lg">
              Sell a Laser
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
