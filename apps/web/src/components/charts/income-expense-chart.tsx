"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSeriesData {
  month: string;  // Format: YYYY-MM
  income: number;
  expenses: number;
}

interface IncomeExpenseChartProps {
  data: TimeSeriesData[];
  isLoading?: boolean;
}

export function IncomeExpenseChart({ data, isLoading = false }: IncomeExpenseChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available for the selected period
          </div>
        </CardContent>
      </Card>
    );
  }

  // For single month data, we'll show it as a bar chart
  const isSingleMonth = data.length === 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  const date = new Date(parseInt(year), parseInt(month) - 1);
                  return date.toLocaleDateString('en-US', { 
                    month: 'short',
                    year: 'numeric'
                  });
                }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                labelFormatter={(label) => {
                  const [year, month] = label.split('-');
                  const date = new Date(parseInt(year), parseInt(month) - 1);
                  return date.toLocaleDateString('en-US', { 
                    month: 'long',
                    year: 'numeric'
                  });
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#00C49F"
                strokeWidth={2}
                dot={true}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#FF8042"
                strokeWidth={2}
                dot={true}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 