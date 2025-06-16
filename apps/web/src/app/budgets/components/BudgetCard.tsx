"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Budget } from "./columns";

interface BudgetCardProps {
  budget: Budget;
  onUpdateClick: (budget: Budget) => void;
}

export function BudgetCard({ budget, onUpdateClick }: BudgetCardProps) {
  const date = new Date(`${budget.year}-${budget.month}-01`);
  const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg sm:text-xl font-semibold">
          {monthYear} Budget
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUpdateClick(budget)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Budget Amount</p>
            <p className="text-lg sm:text-xl font-semibold">
              ${Number(budget.amount).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="text-lg sm:text-xl font-semibold text-red-600">
              ${Number(budget.spent).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-lg sm:text-xl font-semibold text-green-600">
              ${Number(budget.remaining).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 