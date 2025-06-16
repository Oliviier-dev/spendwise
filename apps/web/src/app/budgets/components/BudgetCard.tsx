"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Budget } from "./columns";

interface BudgetCardProps {
  budget: Budget;
  onUpdateClick: (budget: Budget) => void;
}

export function BudgetCard({ budget, onUpdateClick }: BudgetCardProps) {
  // Parse the YYYY-MM format to a proper date
  const budgetDate = new Date(budget.month + "-01");
  const formattedDate = budgetDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formattedDate} Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Budget Amount</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(budget.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(budget.spent || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(budget.remaining || 0)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onUpdateClick(budget)}
          >
            Update Budget
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 