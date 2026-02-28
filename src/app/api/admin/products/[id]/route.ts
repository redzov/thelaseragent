import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveImageUrl } from "@/lib/products";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        categories: { include: { category: true } },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const productWithResolvedImages = {
      ...product,
      images: product.images.map((img) => ({
        ...img,
        url: resolveImageUrl(img.url, product.slug),
      })),
    };

    return NextResponse.json(productWithResolvedImages);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch product" },
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

    const {
      title,
      slug,
      description,
      longDescription,
      price,
      callForPrice,
      manufacturer,
      model,
      year,
      status,
      featured,
      isDeal,
      sku,
      referenceNumber,
      applications,
      systemIncludes,
      metaTitle,
      metaDescription,
    } = body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(longDescription !== undefined && {
          longDescription: longDescription || null,
        }),
        ...(price !== undefined && { price }),
        ...(callForPrice !== undefined && { callForPrice }),
        ...(manufacturer !== undefined && {
          manufacturer: manufacturer || null,
        }),
        ...(model !== undefined && { model: model || null }),
        ...(year !== undefined && { year: year ? parseInt(year) : null }),
        ...(status !== undefined && { status }),
        ...(featured !== undefined && { featured }),
        ...(isDeal !== undefined && { isDeal }),
        ...(sku !== undefined && { sku: sku || null }),
        ...(referenceNumber !== undefined && {
          referenceNumber: referenceNumber || null,
        }),
        ...(applications !== undefined && {
          applications: applications || null,
        }),
        ...(systemIncludes !== undefined && {
          systemIncludes: systemIncludes || null,
        }),
        ...(metaTitle !== undefined && { metaTitle: metaTitle || null }),
        ...(metaDescription !== undefined && {
          metaDescription: metaDescription || null,
        }),
      },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Failed to update product" },
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
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
