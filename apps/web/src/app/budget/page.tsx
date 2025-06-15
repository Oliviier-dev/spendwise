"use client";

import { useState } from "react";
import { BudgetSummaryCard } from "./components/BudgetSummaryCard";
import { BudgetForm } from "./components/BudgetForm";
import { BudgetChart } from "./components/BudgetChart";

// Dummy data for the chart
const dummyChartData = [
  { date: "Jan", budget: 1000, spent: 850 },
  { date: "Feb", budget: 1000, spent: 920 },
  { date: "Mar", budget: 1000, spent: 780 },
  { date: "Apr", budget: 1000, spent: 950 },
  { date: "May", budget: 1000, spent: 880 },
  { date: "Jun", budget: 1000, spent: 900 },
];

export default function BudgetPage() {
  const [budget, setBudget] = useState(1000);
  const [spent, setSpent] = useState(850);

  const handleBudgetUpdate = (newBudget: number) => {
    setBudget(newBudget);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Budget</h1>
      
      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <BudgetSummaryCard
            budgetSet={budget}
            spent={spent}
            remaining={budget - spent}
          />
          <BudgetForm
            currentBudget={budget}
            onBudgetUpdate={handleBudgetUpdate}
          />
        </div>
        
        <BudgetChart data={dummyChartData} />
      </div>
    </div>
  );
} 