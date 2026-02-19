import Link from "next/link";
import { ShoppingCart, DollarSign, Wrench, Truck } from "lucide-react";

const services = [
  {
    icon: ShoppingCart,
    title: "BUY A LASER",
    description:
      "Explore our selection of used laser equipment for sale that combines affordability with performance. Each piece is a testament to quality, ensuring your practice benefits without compromising on outcomes.",
    link: "/laser-machines-for-sale",
    linkText: "Buy A Laser",
  },
  {
    icon: DollarSign,
    title: "SELL A LASER",
    description:
      "Ready to make room for something new or simply looking to monetize your used aesthetic equipment? Whether it's used cosmetic lasers or medical lasers, convert that equipment into capital.",
    link: "/sell-a-laser",
    linkText: "Sell A Laser",
  },
  {
    icon: Wrench,
    title: "SERVICE A LASER",
    description:
      "Equipment longevity is a priority. From meticulous refurbishments to preventative maintenance, our services ensure your laser equipment runs optimally, session after session.",
    link: "/laser-repair",
    linkText: "Service A Laser",
  },
  {
    icon: Truck,
    title: "SHIPPING & DELIVERY",
    description:
      "Acquiring a laser shouldn't be a logistical puzzle. We've refined our shipping and delivery process, ensuring that your chosen used aesthetic equipment reaches you promptly and safely, anywhere in the United States.",
    link: "/shipping-delivery",
    linkText: "Shipping & Delivery",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          Our Services
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group bg-[#1a1a1a] rounded-lg p-6 border border-transparent hover:border-[#5ABA47] transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4">
                  <Icon className="w-12 h-12 text-[#5ABA47]" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-[#c9c9c9] text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Link */}
                <Link
                  href={service.link}
                  className="inline-flex items-center text-[#5ABA47] text-sm font-medium hover:underline"
                >
                  {service.linkText}
                  <svg
                    className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
