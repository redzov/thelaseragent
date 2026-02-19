import { NextResponse } from "next/server";
import { getPriceFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = getPriceFormSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const data = result.data;

    // TODO: Replace with Resend email integration
    console.log("[Get Price Form Submission]", data);

    return NextResponse.json({
      success: true,
      message: "Thank you for your inquiry! We'll send you pricing details shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
