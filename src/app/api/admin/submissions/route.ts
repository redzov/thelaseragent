import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const formType = searchParams.get("formType") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("perPage") || "20"))
    );
    const skip = (page - 1) * perPage;

    const where = formType ? { formType } : {};

    const [submissions, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.formSubmission.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch {
    return NextResponse.json({
      submissions: [],
      total: 0,
      page: 1,
      perPage: 20,
      totalPages: 0,
    });
  }
}
