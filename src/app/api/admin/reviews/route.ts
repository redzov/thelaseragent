import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { authorName, text, rating, photo, authorImage, isPublished, source, reviewDate } = body;

    if (!authorName || !text) {
      return NextResponse.json(
        { error: "Author name and text are required" },
        { status: 400 }
      );
    }

    const maxSort = await prisma.review.aggregate({
      _max: { sortOrder: true },
    });

    const review = await prisma.review.create({
      data: {
        authorName,
        text,
        rating: rating ? parseInt(String(rating)) : 5,
        photo: photo || null,
        authorImage: authorImage || null,
        isPublished: isPublished ?? true,
        source: source || "google",
        reviewDate: reviewDate ? new Date(reviewDate) : null,
        sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
