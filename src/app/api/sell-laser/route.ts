import { NextResponse } from "next/server";
import { sellLaserFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = sellLaserFormSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const data = result.data;

    // TODO: Replace with Resend email integration
    console.log("[Sell Laser Form Submission]", data);

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll review your submission and get back to you shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
