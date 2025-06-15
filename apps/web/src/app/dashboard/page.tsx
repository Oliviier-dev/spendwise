"use client"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StatCard } from "@/components/stat-card"
import { ExpensePieChart } from "@/components/charts/expense-pie-chart";
import { IncomeExpenseChart } from "@/components/charts/income-expense-chart";
import { BudgetProgress } from "@/components/charts/budget-progress";

// Mock data
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

export default function Dashboard() {
  // const router = useRouter();
  // const { data: session, isPending } = authClient.useSession();


  // useEffect(() => {
  //   if (!session && !isPending) {
  //     router.push("/login");
  //   }
  // }, [session, isPending]);

  // if (isPending) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Here's an overview of your financial status
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Current Balance"
          amount="$12,234.00"
          growth={4.2}
        />
        <StatCard
          title="Income"
          amount="$4,500.00"
          growth={2.1}
        />
        <StatCard
          title="Expenses"
          amount="$2,800.00"
          growth={-2.3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <IncomeExpenseChart data={mockTimeSeriesData} />
        <ExpensePieChart data={mockExpenseData} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <BudgetProgress
          category="Food"
          spent={400}
          total={500}
        />
        <BudgetProgress
          category="Transport"
          spent={300}
          total={300}
        />
        <BudgetProgress
          category="Entertainment"
          spent={200}
          total={200}
        />
      </div>
    </div>
  );
}
