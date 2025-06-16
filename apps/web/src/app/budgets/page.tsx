"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { BudgetTable } from "./components/BudgetTable";
import { AddBudgetModal } from "./components/AddBudgetModal";
import { UpdateBudgetModal } from "./components/UpdateBudgetModal";
import { BudgetCard } from "./components/BudgetCard";
import type { Budget } from "./components/columns";

export default function BudgetsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Mock data for budgets table
  const budgets = [
    {
      id: "1",
      amount: 5000,
      spent: 2500,
      remaining: 2500,
      month: "03",
      year: "2024"
    },
    {
      id: "2",
      amount: 6000,
      spent: 3000,
      remaining: 3000,
      month: "08",
      year: "2024"
    },
    {
      id: "3",
      amount: 7000,
      spent: 3500,
      remaining: 3500,
      month: "12",
      year: "2024"
    },
  ];

  // Find the current, next, or most recent past month's budget
  const currentMonthBudget = useMemo(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-12

    // Sort budgets by date (newest first)
    const sortedBudgets = [...budgets].sort((a, b) => {
      const dateA = new Date(`${a.year}-${a.month}-01`);
      const dateB = new Date(`${b.year}-${b.month}-01`);
      return dateB.getTime() - dateA.getTime();
    });

    // First try to find current or future budget
    const futureBudget = sortedBudgets.find(budget => {
      const budgetDate = new Date(`${budget.year}-${budget.month}-01`);
      return budgetDate >= currentDate;
    });

    // If no future budget found, return the most recent past budget
    return futureBudget || sortedBudgets[0] || null;
  }, [budgets]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {/* Current/Next/Past Month Budget Card */}
      {currentMonthBudget && (
        <BudgetCard 
          budget={currentMonthBudget}
          onUpdateClick={(budget) => {
            setSelectedBudget(budget);
            setIsUpdateModalOpen(true);
          }}
        />
      )}

      {/* Budgets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetTable 
            budgets={budgets}
            onRowClick={(budget) => {
              setSelectedBudget(budget);
              setIsUpdateModalOpen(true);
            }}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <AddBudgetModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
      />
      
      <UpdateBudgetModal 
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        budget={selectedBudget}
      />
    </div>
  );
} 