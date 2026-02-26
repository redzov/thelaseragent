import Link from "next/link";

const brands = [
  { name: "Alma", href: "/alma-lasers" },
  { name: "BTL", href: "/btl-lasers" },
  { name: "Candela", href: "/candela-lasers" },
  { name: "Cutera", href: "/cutera-lasers" },
  { name: "Cutting Edge", href: "/cutting-edge-lasers" },
  { name: "Cynosure", href: "/cynosure-lasers" },
  { name: "HydraFacial", href: "/hydrafacial-lasers" },
  { name: "Lumenis", href: "/lumenis-lasers" },
  { name: "Lutronic", href: "/lutronic-lasers" },
  { name: "Luxar", href: "/luxar-lasers" },
  { name: "Palomar", href: "/palomar-lasers" },
  { name: "Quanta", href: "/quanta-lasers" },
  { name: "Solta Medical", href: "/solta-medical-lasers" },
  { name: "Syneron", href: "/syneron-lasers" },
  { name: "Venus", href: "/venus-lasers" },
  { name: "Vivace", href: "/vivace-lasers" },
  { name: "Zimmer", href: "/zimmer-lasers" },
];

export default function BrandsGrid() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          Featured Laser Brands
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="text-center py-4 px-3 rounded-lg bg-[#1a1a1a] text-[#2196F3] font-medium hover:underline hover:bg-[#1a1a1a]/80 transition-all duration-200"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
