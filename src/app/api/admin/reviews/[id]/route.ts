import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { authorName, text, rating, photo, authorImage, isPublished, source, reviewDate, sortOrder } = body;

    const review = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        ...(authorName !== undefined && { authorName }),
        ...(text !== undefined && { text }),
        ...(rating !== undefined && { rating: parseInt(String(rating)) }),
        ...(photo !== undefined && { photo: photo || null }),
        ...(authorImage !== undefined && { authorImage: authorImage || null }),
        ...(isPublished !== undefined && { isPublished }),
        ...(source !== undefined && { source }),
        ...(reviewDate !== undefined && {
          reviewDate: reviewDate ? new Date(reviewDate) : null,
        }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(String(sortOrder)) }),
      },
    });

    return NextResponse.json(review);
  } catch {
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.review.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
