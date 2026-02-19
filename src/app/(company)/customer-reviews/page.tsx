import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { Star } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

interface Review {
  authorName: string;
  rating: number;
  text: string;
  date: string;
  timestamp: number;
  profileUrl: string;
  avatarUrl: string;
}

interface ReviewsData {
  businessName: string;
  overallRating: number;
  totalReviews: string;
  reviews: Review[];
}

function loadReviews(): ReviewsData {
  const filePath = path.join(process.cwd(), "scripts", "data", "reviews.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as ReviewsData;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-[#333]"}
        />
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: `Read customer reviews of ${SITE_NAME}. See what our customers say about buying, selling, and servicing laser equipment with us.`,
  openGraph: {
    title: `Customer Reviews | ${SITE_NAME}`,
    description: `Read customer reviews of ${SITE_NAME}. Rated 5 stars on Google.`,
  },
};

export default function CustomerReviewsPage() {
  const data = loadReviews();

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Customer Reviews</h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <StarRating rating={data.overallRating} />
            <span className="text-white font-semibold text-lg">{data.overallRating}/5</span>
          </div>
          <p className="text-[#c9c9c9] text-lg">{data.totalReviews}</p>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.reviews.map((review) => (
              <div
                key={review.timestamp}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#333] flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={review.avatarUrl}
                      alt={review.authorName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={review.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium hover:text-[#5ABA47] transition-colors block truncate"
                    >
                      {review.authorName}
                    </a>
                    <p className="text-[#666] text-sm">{review.date}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="mb-3">
                  <StarRating rating={review.rating} />
                </div>

                {/* Review text */}
                <p className="text-[#c9c9c9] text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
