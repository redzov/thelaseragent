import type { Metadata } from "next";
import { Star } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { getPublishedReviews, getReviewStats } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: `Read customer reviews of ${SITE_NAME}. See what our customers say about buying, selling, and servicing laser equipment with us.`,
};

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

export default async function CustomerReviewsPage() {
  const [reviews, stats] = await Promise.all([
    getPublishedReviews(),
    getReviewStats(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0d0d0d] py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Customer Reviews
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <StarRating rating={Math.round(stats.averageRating)} />
            <span className="text-white font-semibold text-lg">
              {stats.averageRating}/5
            </span>
          </div>
          <p className="text-[#c9c9c9] text-lg">
            {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {reviews.length === 0 ? (
            <p className="text-center text-[#c9c9c9] text-lg">
              No reviews yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden"
                >
                  {review.photo && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={review.photo}
                      alt={`Review by ${review.authorName}`}
                      className="w-full aspect-video object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {review.authorName}
                    </h3>
                    <div className="mb-3">
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-[#c9c9c9] text-sm leading-relaxed">
                      {review.text}
                    </p>
                    {review.reviewDate && (
                      <p className="text-[#666] text-sm mt-3">
                        {new Date(review.reviewDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
