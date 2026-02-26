import { NextResponse } from "next/server";
import { productInquirySchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";
import { SITE_URL } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = productInquirySchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const { name, email, phone, message, productSlug, productTitle } =
      result.data;

    await prisma.formSubmission.create({
      data: {
        formType: "product-inquiry",
        productSlug,
        email,
        data: { name, email, phone, message, productSlug, productTitle },
      },
    });

    await sendTelegramNotification(
      `🔔 New Product Inquiry\n\nURL: ${SITE_URL}/product/${productSlug}\nProduct: ${productTitle}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || "N/A"}`
    );

    return NextResponse.json({
      success: true,
      message:
        "Thank you for your inquiry! We'll get back to you shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
