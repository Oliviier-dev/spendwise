import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema/transactions";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { withAuth } from "@/lib/auth-middleware";

const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.string(),
  description: z.string().optional(),
  date: z.string().optional(),
});

async function createTransaction(req: Request, context: { user: any }) {
  try {
    const body = await req.json();
    const validatedData = transactionSchema.parse(body);

    const insertData = {
      userId: context.user.id,
      amount: validatedData.amount.toFixed(2),
      type: validatedData.type,
      category: validatedData.category,
      description: validatedData.description,
      date: validatedData.date ? new Date(validatedData.date) : new Date(),
    };

    const transaction = await db.insert(transactions).values(insertData).returning();

    return NextResponse.json({
      message: "Transaction created successfully",
      data: transaction[0]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[TRANSACTIONS_POST] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getTransactions(req: Request, context: { user: any }) {
  try {
    const userTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, context.user.id))
      .orderBy(desc(transactions.date));

    return NextResponse.json({
      message: "Transactions retrieved successfully",
      data: userTransactions
    });
  } catch (error) {
    console.error("[TRANSACTIONS_GET] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createTransaction);
export const GET = withAuth(getTransactions);
