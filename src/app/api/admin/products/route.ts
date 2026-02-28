import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveImageUrl } from "@/lib/products";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const q = searchParams.get("q") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("perPage") || "20")));
    const skip = (page - 1) * perPage;

    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { manufacturer: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { orderBy: { sortOrder: "asc" } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithResolvedImages = products.map((p) => ({
      ...p,
      images: p.images.map((img) => ({
        ...img,
        url: resolveImageUrl(img.url, p.slug),
      })),
    }));

    return NextResponse.json({
      products: productsWithResolvedImages,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch {
    return NextResponse.json({
      products: [],
      total: 0,
      page: 1,
      perPage: 20,
      totalPages: 0,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
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
      images,
    } = body;

    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: "Title, slug, and description are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        longDescription: longDescription || null,
        price: price || 0,
        callForPrice: callForPrice ?? true,
        manufacturer: manufacturer || null,
        model: model || null,
        year: year ? parseInt(year) : null,
        status: status || "ACTIVE",
        featured: featured ?? false,
        isDeal: isDeal ?? false,
        sku: sku || null,
        referenceNumber: referenceNumber || null,
        applications: applications || null,
        systemIncludes: systemIncludes || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        images: images?.length
          ? {
              create: images.map(
                (
                  img: { url: string; alt?: string; isPrimary?: boolean },
                  idx: number
                ) => ({
                  url: img.url,
                  alt: img.alt || "",
                  sortOrder: idx,
                  isPrimary: img.isPrimary ?? idx === 0,
                })
              ),
            }
          : undefined,
      },
      include: { images: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
