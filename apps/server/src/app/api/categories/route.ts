import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema/categories";
import { z } from "zod";
import { eq, or } from "drizzle-orm";
import { withAuth } from "@/lib/auth-middleware";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["income", "expense"]),
});

async function createCategory(req: Request, context: { user: any }) {
  try {
    const body = await req.json();
    const validatedData = categorySchema.parse(body);

    const category = await db.insert(categories).values({
      userId: context.user.id,
      name: validatedData.name,
      type: validatedData.type,
      isDefault: false,
    }).returning();

    return NextResponse.json({
      message: "Category created successfully",
      data: category[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[CATEGORIES_POST] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getCategories(req: Request, context: { user: any }) {
  try {
    const userCategories = await db
      .select()
      .from(categories)
      .where(
        or(
          eq(categories.userId, context.user.id),
          eq(categories.isDefault, true)
        )
      );

    return NextResponse.json({
      message: "Categories retrieved successfully",
      data: userCategories
    });
  } catch (error) {
    console.error("[CATEGORIES_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createCategory);
export const GET = withAuth(getCategories);