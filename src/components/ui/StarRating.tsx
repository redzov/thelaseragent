import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export default function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "fill-[#fbbf24] text-[#fbbf24]"
              : "fill-[#4b5563] text-[#4b5563]"
          }`}
        />
      ))}
    </div>
  );
}
