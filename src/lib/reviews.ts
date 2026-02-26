import { prisma } from "@/lib/prisma";

export async function getPublishedReviews() {
  return prisma.review.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getReviewStats() {
  const reviews = await prisma.review.findMany({
    where: { isPublished: true },
    select: { rating: true },
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 5;

  return { totalReviews, averageRating: Math.round(averageRating * 10) / 10 };
}
