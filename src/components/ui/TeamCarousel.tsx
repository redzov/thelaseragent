"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Mail, Linkedin } from "lucide-react";
import Image from "next/image";

interface TeamMember {
  name: string;
  title: string;
  photo?: string | null;
  email?: string | null;
  linkedIn?: string | null;
}

interface TeamCarouselProps {
  members: TeamMember[];
}

export default function TeamCarousel({ members }: TeamCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      {/* Navigation arrows */}
      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white hover:bg-[#5ABA47] hover:border-[#5ABA47] transition-colors cursor-pointer hidden md:flex"
        aria-label="Previous team member"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white hover:bg-[#5ABA47] hover:border-[#5ABA47] transition-colors cursor-pointer hidden md:flex"
        aria-label="Next team member"
      >
        <ChevronRight size={20} />
      </button>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {members.map((member, index) => (
            <div
              key={index}
              className="flex-none pl-4 w-full sm:w-1/2 lg:w-1/3"
            >
              <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 text-center h-full flex flex-col items-center">
                {/* Photo */}
                <div className="w-32 h-32 rounded-full overflow-hidden bg-[#333] mb-4 flex-shrink-0">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#666] text-4xl font-semibold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-[#5ABA47] text-sm mb-4">{member.title}</p>

                {/* Links */}
                <div className="flex items-center gap-3 mt-auto">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="w-9 h-9 rounded-full bg-[#333] flex items-center justify-center text-[#c9c9c9] hover:bg-[#5ABA47] hover:text-white transition-colors"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail size={16} />
                    </a>
                  )}
                  {member.linkedIn && (
                    <a
                      href={member.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-[#333] flex items-center justify-center text-[#c9c9c9] hover:bg-[#5ABA47] hover:text-white transition-colors"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="flex justify-center gap-3 mt-6 md:hidden">
        <button
          type="button"
          onClick={scrollPrev}
          className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white hover:bg-[#5ABA47] hover:border-[#5ABA47] transition-colors cursor-pointer"
          aria-label="Previous team member"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-white hover:bg-[#5ABA47] hover:border-[#5ABA47] transition-colors cursor-pointer"
          aria-label="Next team member"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
