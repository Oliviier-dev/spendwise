import { NextResponse } from "next/server";
import { db } from "@/db";
import { savingGoals } from "@/db/schema/saving-goals";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/auth-middleware";

const updateSavingGoalSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  targetAmount: z.number().positive("Target amount must be positive").optional(),
  currentAmount: z.number().min(0, "Current amount cannot be negative").optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional(),
  isCompleted: z.boolean().optional(),
});

async function updateSavingGoal(req: Request, context: { user: any }, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validatedData = updateSavingGoalSchema.parse(body);

    const existingGoal = await db
      .select()
      .from(savingGoals)
      .where(
        and(
          eq(savingGoals.id, params.id),
          eq(savingGoals.userId, context.user.id)
        )
      )
      .limit(1);

    if (!existingGoal.length) {
      return NextResponse.json(
        { message: "Saving goal not found" },
        { status: 404 }
      );
    }

    const updateData: Partial<typeof savingGoals.$inferInsert> = {
      updatedAt: new Date()
    };

    if (validatedData.name !== undefined) {
      updateData.name = validatedData.name;
    }
    if (validatedData.targetAmount !== undefined) {
      updateData.targetAmount = validatedData.targetAmount.toFixed(2);
    }
    if (validatedData.currentAmount !== undefined) {
      updateData.currentAmount = validatedData.currentAmount.toFixed(2);
    }
    if (validatedData.targetDate !== undefined) {
      updateData.targetDate = new Date(validatedData.targetDate);
    }
    if (validatedData.isCompleted !== undefined) {
      updateData.isCompleted = validatedData.isCompleted;
    }

    const updatedGoal = await db
      .update(savingGoals)
      .set(updateData)
      .where(
        and(
          eq(savingGoals.id, params.id),
          eq(savingGoals.userId, context.user.id)
        )
      )
      .returning();

    return NextResponse.json({
      message: "Saving goal updated successfully",
      data: updatedGoal[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[SAVING_GOAL_PATCH] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function deleteSavingGoal(req: Request, context: { user: any }, { params }: { params: { id: string } }) {
  try {
    const existingGoal = await db
      .select()
      .from(savingGoals)
      .where(
        and(
          eq(savingGoals.id, params.id),
          eq(savingGoals.userId, context.user.id)
        )
      )
      .limit(1);

    if (!existingGoal.length) {
      return NextResponse.json(
        { message: "Saving goal not found" },
        { status: 404 }
      );
    }

    await db
      .delete(savingGoals)
      .where(
        and(
          eq(savingGoals.id, params.id),
          eq(savingGoals.userId, context.user.id)
        )
      );

    return NextResponse.json({
      message: "Saving goal deleted successfully"
    });
  } catch (error) {
    console.error("[SAVING_GOAL_DELETE] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const PATCH = withAuth(updateSavingGoal);
export const DELETE = withAuth(deleteSavingGoal); 