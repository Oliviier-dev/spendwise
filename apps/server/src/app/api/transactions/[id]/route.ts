import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema/transactions";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/auth-middleware";

const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
});

async function getTransaction(req: Request, context: { user: any }, { params }: { params: { id: string } }) {
  try {
    const transaction = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, params.id),
          eq(transactions.userId, context.user.id)
        )
      )
      .limit(1);

    if (!transaction || transaction.length === 0) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Transaction retrieved successfully",
      data: transaction[0]
    });
  } catch (error) {
    console.error("[TRANSACTION_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function updateTransaction(req: Request, context: { user: any }, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validatedData = updateTransactionSchema.parse(body);

    // Check if the transaction exists and belongs to the user
    const existingTransaction = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, params.id),
          eq(transactions.userId, context.user.id)
        )
      )
      .limit(1);

    if (!existingTransaction || existingTransaction.length === 0) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = { ...validatedData };
    if (updateData.amount) {
      updateData.amount = updateData.amount.toFixed(2);
    }
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }
    updateData.updatedAt = new Date();

    const updatedTransaction = await db
      .update(transactions)
      .set(updateData)
      .where(
        and(
          eq(transactions.id, params.id),
          eq(transactions.userId, context.user.id)
        )
      )
      .returning();

    return NextResponse.json({
      message: "Transaction updated successfully",
      data: updatedTransaction[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[TRANSACTION_PATCH] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function deleteTransaction(req: Request, context: { user: any }, { params }: { params: { id: string } }) {
  try {
    // Check if the transaction exists and belongs to the user
    const existingTransaction = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, params.id),
          eq(transactions.userId, context.user.id)
        )
      )
      .limit(1);

    if (!existingTransaction || existingTransaction.length === 0) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.id, params.id),
          eq(transactions.userId, context.user.id)
        )
      );

    return NextResponse.json({
      message: "Transaction deleted successfully"
    });
  } catch (error) {
    console.error("[TRANSACTION_DELETE] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getTransaction);
export const PATCH = withAuth(updateTransaction);
export const DELETE = withAuth(deleteTransaction); 