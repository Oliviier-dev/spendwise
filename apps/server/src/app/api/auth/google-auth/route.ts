import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST() {
  try {
    const result = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_CLIENT_URL}/dashboard`
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Social sign in error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "An unexpected error occurred during social sign in." 
      },
      { status: 500 }
    );
  }
}
