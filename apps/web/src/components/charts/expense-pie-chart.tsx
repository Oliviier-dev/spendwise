"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategoryExpense } from "@/types/stats";

interface ExpensePieChartProps {
  data: CategoryExpense[];
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ExpensePieChart({ data, isLoading = false }: ExpensePieChartProps) {
  const normalizedData = data.reduce((acc, curr) => {
    const existingCategory = acc.find(item => 
      item.category.toLowerCase() === curr.category.toLowerCase()
    );
    
    if (existingCategory) {
      existingCategory.total += curr.total;
    } else {
      acc.push({ ...curr });
    }
    
    return acc;
  }, [] as CategoryExpense[]);


  const sortedData = normalizedData.sort((a, b) => b.total - a.total);

  // Take top 4 categories and combine the rest into "Other"
  const topCategories = sortedData.slice(0, 4);
  const otherCategories = sortedData.slice(4);

  let otherTotal = otherCategories.reduce((sum, category) => sum + category.total, 0);

  const otherIndex = topCategories.findIndex(cat => cat.category.toLowerCase() === "other");
  if (otherIndex !== -1) {
    topCategories[otherIndex].total += otherTotal;
    otherTotal = 0;
  }

  const finalData = [
    ...topCategories,
    ...(otherTotal > 0 ? [{ category: "Other", total: otherTotal }] : [])
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (finalData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground text-center">
            No expense data available for this period
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={finalData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
                nameKey="category"
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
              >
                {finalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 