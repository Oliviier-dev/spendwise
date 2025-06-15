"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetProgressProps {
  spent: number;
  total: number;
  category: string;
}

export function BudgetProgress({ spent, total, category }: BudgetProgressProps) {
  const percentage = (spent / total) * 100;
  const remaining = total - spent;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category} Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-medium">${spent.toFixed(2)}</span>
            </div>
            <Progress value={percentage} className="h-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-medium">${remaining.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {percentage >= 100 ? (
              <span className="text-red-500">Budget exceeded by ${Math.abs(remaining).toFixed(2)}</span>
            ) : (
              <span>{percentage.toFixed(0)}% of budget used</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 