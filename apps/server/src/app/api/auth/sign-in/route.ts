import { NextResponse } from "next/server";
import { signIn } from "@/actions/users";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = await signIn(email, password);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, message: result.message || "Sign in failed." },
        { status: 400 }
      );
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during sign in.";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}