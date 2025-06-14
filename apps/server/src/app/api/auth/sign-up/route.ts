import { NextResponse } from "next/server";
import { signUp } from "@/actions/users";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const result = await signUp(
        email,
        password,
        name
    );

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, message: result.message || "Sign up failed." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "An unexpected error occurred during sign up." 
      },
      { status: 500 }
    );
  }
} 