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
import { addMonths, format } from "date-fns";
import { statsApi } from "@/lib/api-client";
import { toast } from "sonner";

// Mock data for charts
const mockExpenseData = [
  { name: "Food", value: 400 },
  { name: "Transport", value: 300 },
  { name: "Entertainment", value: 200 },
  { name: "Shopping", value: 100 },
  { name: "Bills", value: 150 },
];

const mockTimeSeriesData = [
  { date: "2024-01-01", income: 4000, expense: 2400 },
  { date: "2024-01-15", income: 3000, expense: 1398 },
  { date: "2024-02-01", income: 2000, expense: 9800 },
  { date: "2024-02-15", income: 2780, expense: 3908 },
  { date: "2024-03-01", income: 1890, expense: 4800 },
];

interface OverviewStats {
  income: number;
  expenses: number;
  netIncome: number;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      if (!date?.from || !date?.to) return;

      try {
        setIsLoading(true);
        const response = await statsApi.getOverview({
          startDate: format(date.from, 'yyyy-MM-dd'),
          endDate: format(date.to, 'yyyy-MM-dd'),
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch overview stats:", error);
        toast.error("Failed to fetch overview stats. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
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
          amount={`$${Math.abs(stats.netIncome).toLocaleString()}`}
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
        <IncomeExpenseChart data={mockTimeSeriesData} />
        <ExpensePieChart data={mockExpenseData} />
      </div>
    </div>
  );
}
