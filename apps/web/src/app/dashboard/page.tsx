"use client"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/stat-card"
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { BudgetProgress } from "@/components/charts/budget-progress";
import { DateRangePicker } from "@/components/date-range-picker";
import type { DateRange } from "react-day-picker";
import { addMonths, subMonths, format } from "date-fns";
import { statsApi } from "@/lib/api-client";
import { toast } from "sonner";
import type { CategoryExpense } from "@/types/stats";

interface OverviewStats {
  income: number;
  expenses: number;
  netIncome: number;
}

interface MonthlyTrend {
  month: string;  // Format: YYYY-MM
  income: number;
  expenses: number;
}

export default function Dashboard() {
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: today,
    to: addMonths(today, 1),
  });

  const [stats, setStats] = useState<OverviewStats>({
    income: 0,
    expenses: 0,
    netIncome: 0,
  });
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingTrends, setIsLoadingTrends] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!date?.from || !date?.to) return;

      try {
        setIsLoading(true);
        setIsLoadingCategories(true);
        setIsLoadingTrends(true);

        // For monthly trends, we'll fetch a wider range (3 months before and after)
        const trendsStartDate = subMonths(date.from, 3);
        const trendsEndDate = addMonths(date.to, 3);

        const [overviewResponse, categoriesResponse, trendsResponse] = await Promise.all([
          statsApi.getOverview({
            startDate: format(date.from, 'yyyy-MM-dd'),
            endDate: format(date.to, 'yyyy-MM-dd'),
          }),
          statsApi.getExpensesByCategory({
            startDate: format(date.from, 'yyyy-MM-dd'),
            endDate: format(date.to, 'yyyy-MM-dd'),
          }),
          statsApi.getMonthlyTrends({
            startDate: format(trendsStartDate, 'yyyy-MM-dd'),
            endDate: format(trendsEndDate, 'yyyy-MM-dd'),
          })
        ]);

        setStats(overviewResponse.data);
        setCategoryExpenses(categoriesResponse.data);
        setMonthlyTrends(trendsResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to fetch dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
        setIsLoadingCategories(false);
        setIsLoadingTrends(false);
      }
    };

    fetchData();
  }, [date]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Here's an overview of your financial status
          </p>
        </div>
        <DateRangePicker 
          date={date}
          onDateChange={setDate}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Net Income"
          amount={`$${stats.netIncome.toLocaleString()}`}
          isLoading={isLoading}
          showSign={true}
        />
        <StatCard
          title="Income"
          amount={`$${stats.income.toLocaleString()}`}
          isLoading={isLoading}
        />
        <StatCard
          title="Expenses"
          amount={`$${stats.expenses.toLocaleString()}`}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <IncomeExpenseChart data={monthlyTrends} isLoading={isLoadingTrends} />
        <ExpensePieChart data={categoryExpenses} isLoading={isLoadingCategories} />
      </div>
    </div>
  );
}
