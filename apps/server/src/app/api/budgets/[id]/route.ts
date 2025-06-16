import { NextResponse } from "next/server";
import { db } from "@/db";
import { budgets } from "@/db/schema/budgets";
import { z } from "zod";
import { eq, and, ne } from "drizzle-orm";
import { withAuth } from "@/lib/auth-middleware";

const updateBudgetSchema = z.object({
  amount: z.number().positive().optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(), // Format: YYYY-MM
  year: z.string().regex(/^\d{4}$/).optional(), // Format: YYYY
});


async function updateBudget(req: Request, context: { user: any }, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validatedData = updateBudgetSchema.parse(body);

    // Check if the budget exists and belongs to the user
    const existingBudget = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.id, params.id),
          eq(budgets.userId, context.user.id)
        )
      )
      .limit(1);

    if (!existingBudget.length) {
      return NextResponse.json(
        { message: "Budget not found" },
        { status: 404 }
      );
    }

    if (validatedData.month || validatedData.year) {
      const month = validatedData.month || existingBudget[0].month;
      const year = validatedData.year || existingBudget[0].year;

      const conflictingBudget = await db
        .select()
        .from(budgets)
        .where(
          and(
            eq(budgets.userId, context.user.id),
            eq(budgets.month, month),
            eq(budgets.year, year),
            ne(budgets.id, params.id)
          )
        )
        .limit(1);

      if (conflictingBudget.length > 0) {
        return NextResponse.json(
          { message: "Budget already exists for this month" },
          { status: 400 }
        );
      }
    }

    // Prepare update data with proper typing
    const updateData: Partial<typeof budgets.$inferInsert> = {
      updatedAt: new Date()
    };

    if (validatedData.amount !== undefined) {
      updateData.amount = validatedData.amount.toFixed(2);
    }
    if (validatedData.month !== undefined) {
      updateData.month = validatedData.month;
    }
    if (validatedData.year !== undefined) {
      updateData.year = validatedData.year;
    }

    const updatedBudget = await db
      .update(budgets)
      .set(updateData)
      .where(
        and(
          eq(budgets.id, params.id),
          eq(budgets.userId, context.user.id)
        )
      )
      .returning();

    return NextResponse.json({
      message: "Budget updated successfully",
      data: updatedBudget[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[BUDGET_PATCH] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function deleteBudget(req: Request, context: { user: any }, { params }: { params: { id: string } }) {
  try {
    // Check if the budget exists and belongs to the user
    const existingBudget = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.id, params.id),
          eq(budgets.userId, context.user.id)
        )
      )
      .limit(1);

    if (!existingBudget.length) {
      return NextResponse.json(
        { message: "Budget not found" },
        { status: 404 }
      );
    }

    // Delete the budget
    await db
      .delete(budgets)
      .where(
        and(
          eq(budgets.id, params.id),
          eq(budgets.userId, context.user.id)
        )
      );

    return NextResponse.json({
      message: "Budget deleted successfully"
    });
  } catch (error) {
    console.error("[BUDGET_DELETE] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const PATCH = withAuth(updateBudget);
export const DELETE = withAuth(deleteBudget); 