import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema/transactions";
import { categories } from "@/db/schema/categories";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { withAuth } from "@/lib/auth-middleware";
import { z } from "zod";

const dateRangeSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format (YYYY-MM-DD)"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format (YYYY-MM-DD)"),
});

async function getOverview(req: Request, context: { user: any }) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { message: "Start date and end date are required" },
        { status: 400 }
      );
    }

    dateRangeSchema.parse({ startDate, endDate });

    const conditions = [
      eq(transactions.userId, context.user.id),
      gte(transactions.date, new Date(startDate)),
      lte(transactions.date, new Date(endDate))
    ];

    const [income, expenses] = await Promise.all([
      db
        .select({
          total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)`,
        })
        .from(transactions)
        .where(
          and(
            ...conditions,
            eq(transactions.type, "income")
          )
        ),
      db
        .select({
          total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)`,
        })
        .from(transactions)
        .where(
          and(
            ...conditions,
            eq(transactions.type, "expense")
          )
        ),
    ]);

    const netIncome = Number(income[0].total) - Number(expenses[0].total);

    return NextResponse.json({
      message: "Overview stats retrieved successfully",
      data: {
        income: Number(income[0].total),
        expenses: Number(expenses[0].total),
        netIncome,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid date range", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[STATS_OVERVIEW] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getCategoryBreakdown(req: Request, context: { user: any }) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { message: "Start date and end date are required" },
        { status: 400 }
      );
    }

    dateRangeSchema.parse({ startDate, endDate });

    const conditions = [
      eq(transactions.userId, context.user.id),
      gte(transactions.date, new Date(startDate)),
      lte(transactions.date, new Date(endDate)),
      eq(transactions.type, "expense")
    ];

    const categoryStats = await db
      .select({
        category: transactions.category,
        total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)`,
      })
      .from(transactions)
      .where(and(...conditions))
      .groupBy(transactions.category);

    return NextResponse.json({
      message: "Category breakdown retrieved successfully",
      data: categoryStats.map(stat => ({
        category: stat.category,
        total: Number(stat.total)
      }))
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid date range", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[STATS_CATEGORY] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getMonthlyTrends(req: Request, context: { user: any }) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { message: "Start date and end date are required" },
        { status: 400 }
      );
    }

    dateRangeSchema.parse({ startDate, endDate });

    const conditions = [
      eq(transactions.userId, context.user.id),
      gte(transactions.date, new Date(startDate)),
      lte(transactions.date, new Date(endDate))
    ];

    const monthlyStats = await db
      .select({
        month: sql<string>`TO_CHAR(${transactions.date}, 'YYYY-MM')`,
        type: transactions.type,
        total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)`,
      })
      .from(transactions)
      .where(and(...conditions))
      .groupBy(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`, transactions.type)
      .orderBy(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`);

    // Transform the data
    const monthlyData = monthlyStats.reduce((acc, stat) => {
      const month = stat.month;
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      acc[month][stat.type === "income" ? "income" : "expenses"] = Number(stat.total);
      return acc;
    }, {} as Record<string, { month: string; income: number; expenses: number }>);

    return NextResponse.json({
      message: "Monthly trends retrieved successfully",
      data: Object.values(monthlyData)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid date range", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("[STATS_MONTHLY] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(async (req: Request, context: { user: any }) => {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  switch (type) {
    case "overview":
      return getOverview(req, context);
    case "category":
      return getCategoryBreakdown(req, context);
    case "monthly":
      return getMonthlyTrends(req, context);
    default:
      return NextResponse.json(
        { message: "Invalid stats type. Use 'overview', 'category', or 'monthly'" },
        { status: 400 }
      );
  }
}); 