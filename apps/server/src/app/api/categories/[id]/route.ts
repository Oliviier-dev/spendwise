import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema/categories";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/auth-middleware";

async function deleteCategory(req: Request, context: { user: any }, { params }: { params: { id: string } }) {
  try {
    const category = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, params.id),
          eq(categories.userId, context.user.id)
        )
      )
      .limit(1);

    if (!category.length) {
      return NextResponse.json(
        { message: "Category not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Check if it's a default category
    if (category[0].isDefault) {
      return NextResponse.json(
        { message: "Cannot delete default categories" },
        { status: 403 }
      );
    }

    // Delete the category
    await db
      .delete(categories)
      .where(
        and(
          eq(categories.id, params.id),
          eq(categories.userId, context.user.id)
        )
      );

    return NextResponse.json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("[CATEGORY_DELETE] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const DELETE = withAuth(deleteCategory);