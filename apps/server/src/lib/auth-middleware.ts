import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type HandlerFunction = (req: Request, context: { user: any }, ...args: any[]) => Promise<NextResponse>;

export function withAuth(handler: HandlerFunction) {
  return async (req: Request, ...args: any[]) => {
    try {
      const session = await auth.api.getSession(req);
      if (!session?.user?.id) {
        return NextResponse.json(
          { message: "Unauthorized access" },
          { status: 401 }
        );
      }

      // Add user to request context
      const context = { user: session.user };
      return await handler(req, context, ...args);
    } catch (error) {
      console.error("[AUTH_MIDDLEWARE] Error:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  };
} 