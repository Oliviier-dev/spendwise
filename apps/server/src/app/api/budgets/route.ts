import { NextResponse } from "next/server";
import { db } from "@/db";
import { budgets } from "@/db/schema/budgets";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/auth-middleware";

const budgetSchema = z.object({
  amount: z.number().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  year: z.string().regex(/^\d{4}$/),
});

async function createBudget(req: Request, context: { user: any }) {
  try {
    const body = await req.json();
    const validatedData = budgetSchema.parse(body);

    // Check if budget already exists for this month
    const existingBudget = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, context.user.id),
          eq(budgets.month, validatedData.month),
          eq(budgets.year, validatedData.year)
        )
      )
      .limit(1);

    if (existingBudget.length > 0) {
      return NextResponse.json(
        { message: "Budget already exists for this month" },
        { status: 400 }
      );
    }

    const budget = await db.insert(budgets).values({
      userId: context.user.id,
      amount: validatedData.amount.toFixed(2),
      month: validatedData.month,
      year: validatedData.year,
    }).returning();

    return NextResponse.json({
      message: "Budget created successfully",
      data: budget[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[BUDGET_POST] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getBudgets(req: Request, context: { user: any }) {
  try {
    const url = new URL(req.url);
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");

    const conditions = [eq(budgets.userId, context.user.id)];

    if (month && year) {
      conditions.push(eq(budgets.month, month));
      conditions.push(eq(budgets.year, year));
    }

    const query = db
      .select()
      .from(budgets)
      .where(and(...conditions));

    const userBudgets = await query;

    return NextResponse.json({
      message: "Budgets retrieved successfully",
      data: userBudgets
    });
  } catch (error) {
    console.error("[BUDGETS_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createBudget);
export const GET = withAuth(getBudgets); 