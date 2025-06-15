import { NextResponse } from "next/server";
import { db } from "@/db";
import { savingGoals } from "@/db/schema/saving-goals";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth-middleware";

const savingGoalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetAmount: z.number().positive("Target amount must be positive"),
  currentAmount: z.number().min(0, "Current amount cannot be negative").optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
});

async function createSavingGoal(req: Request, context: { user: any }) {
  try {
    const body = await req.json();
    const validatedData = savingGoalSchema.parse(body);

    const goal = await db.insert(savingGoals).values({
      userId: context.user.id,
      name: validatedData.name,
      targetAmount: validatedData.targetAmount.toFixed(2),
      currentAmount: (validatedData.currentAmount || 0).toFixed(2),
      targetDate: new Date(validatedData.targetDate),
    }).returning();

    return NextResponse.json({
      message: "Saving goal created successfully",
      data: goal[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[SAVING_GOAL_POST] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getSavingGoals(req: Request, context: { user: any }) {
  try {
    const goals = await db
      .select()
      .from(savingGoals)
      .where(eq(savingGoals.userId, context.user.id))
      .orderBy(savingGoals.createdAt);

    return NextResponse.json({
      message: "Saving goals retrieved successfully",
      data: goals
    });
  } catch (error) {
    console.error("[SAVING_GOALS_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createSavingGoal);
export const GET = withAuth(getSavingGoals); 