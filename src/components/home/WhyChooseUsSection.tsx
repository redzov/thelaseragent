import {
  CheckCircle,
  Shield,
  Search,
  Award,
  Video,
  ClipboardCheck,
  HeadphonesIcon,
  Truck,
} from "lucide-react";

const benefits = [
  {
    icon: Search,
    title: "Rigorous Selection Process",
    description:
      "Our used lasers aren't just \"used\" in name. Each undergoes strict quality checks to ensure it's as effective as brand-new equipment, guaranteeing consistent performance and reliability.",
  },
  {
    icon: Shield,
    title: "Broad Selection of Equipment",
    description:
      "We provide lasers for hair removal, skin rejuvenation, and scar treatments. Our range ensures you can deliver diverse services and address multiple patient needs with confidence.",
  },
  {
    icon: CheckCircle,
    title: "Transparent Buying Experience",
    description:
      "We give clear details on each laser's history, condition, and maintenance. No hidden fees or surprises\u2014just honest, upfront information to guide your purchase.",
  },
  {
    icon: Award,
    title: "Trusted Industry Reputation",
    description:
      "Years of experience have made us the trusted source for practices seeking high-quality, reliable used lasers that meet professional standards every time.",
  },
  {
    icon: Video,
    title: "Tailored Video Demonstrations",
    description:
      "Get up close and personal with our lasers through custom video demonstrations, designed just for you.",
  },
  {
    icon: ClipboardCheck,
    title: "Thorough Pre-Delivery Checks",
    description:
      "Before any laser heads your way, we give it a thorough once-over to ensure everything's in tip-top shape.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Guidance Whenever You Need",
    description:
      "Got a question or need advice? Our on-site experts are always ready to help.",
  },
  {
    icon: Truck,
    title: "Safe & Secure Nationwide Delivery",
    description:
      "Wherever you are in the country, we ensure your laser arrives safely and promptly.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-14">
          Why Choose Phoenix Aesthetics?
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#2196F3]/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#2196F3]" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-white mb-2">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-[#c9c9c9] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
