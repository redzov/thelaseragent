"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";

interface Review {
  id: number;
  authorName: string;
  authorImage: string | null;
  photo: string | null;
  rating: number;
  text: string;
  source: string;
  reviewDate: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function togglePublish(id: number, isPublished: boolean) {
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isPublished: !isPublished } : r
        )
      );
    } catch {
      alert("Failed to update review");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this review?")) return;
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to delete review");
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={14}
            className={
              i <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        <Link
          href="/admin/reviews/new"
          className="inline-flex items-center gap-2 rounded-md bg-[#5ABA47] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#348923]"
        >
          <Plus size={16} />
          Add Review
        </Link>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5ABA47] border-t-transparent" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-gray-400 shadow-sm">
          No reviews yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`rounded-lg bg-white p-5 shadow-sm ${
                !review.isPublished ? "opacity-60" : ""
              }`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {review.photo || review.authorImage ? (
                    <Image
                      src={review.photo || review.authorImage || ""}
                      alt={review.authorName}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-500">
                      {review.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.authorName}
                    </p>
                    {renderStars(review.rating)}
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    review.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {review.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                {review.text}
              </p>

              <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                <Link
                  href={`/admin/reviews/${review.id}`}
                  className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600"
                  title="Edit"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => togglePublish(review.id, review.isPublished)}
                  className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-orange-600"
                  title={review.isPublished ? "Unpublish" : "Publish"}
                >
                  {review.isPublished ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
