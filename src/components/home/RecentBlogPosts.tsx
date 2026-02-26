"use client";

import Image from "next/image";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const customerPhotos = [
  { src: "/images/customers/customer-1.jpg", alt: "Happy customer with BeautiFill laser equipment" },
  { src: "/images/customers/customer-2.jpg", alt: "Happy customer with HydraFacial machine" },
  { src: "/images/customers/customer-3.jpg", alt: "Phoenix Aesthetics team with customers" },
  { src: "/images/customers/customer-4.jpg", alt: "Happy customer with HydraFacial treatment" },
];

export default function RecentBlogPosts() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-20 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          Our Happy Customers
        </h2>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {customerPhotos.map((photo) => (
                <div
                  key={photo.src}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                >
                  <div className="rounded-lg overflow-hidden aspect-[4/5] relative">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white hover:bg-[#2196F3] hover:border-[#2196F3] transition-colors cursor-pointer hidden md:flex"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white hover:bg-[#2196F3] hover:border-[#2196F3] transition-colors cursor-pointer hidden md:flex"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
