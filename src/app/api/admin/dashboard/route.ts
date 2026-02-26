import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalProducts, totalSubmissions, unreadSubmissions, totalReviews] =
      await Promise.all([
        prisma.product.count().catch(() => 0),
        prisma.formSubmission.count().catch(() => 0),
        prisma.formSubmission.count({ where: { read: false } }).catch(() => 0),
        prisma.review.count().catch(() => 0),
      ]);

    const recentSubmissions = await prisma.formSubmission
      .findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []);

    return NextResponse.json({
      stats: {
        totalProducts,
        totalSubmissions,
        unreadSubmissions,
        totalReviews,
      },
      recentSubmissions,
    });
  } catch {
    return NextResponse.json({
      stats: {
        totalProducts: 0,
        totalSubmissions: 0,
        unreadSubmissions: 0,
        totalReviews: 0,
      },
      recentSubmissions: [],
    });
  }
}
