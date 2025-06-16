"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { BudgetTable } from "./components/BudgetTable";
import { AddBudgetModal } from "./components/AddBudgetModal";
import { UpdateBudgetModal } from "./components/UpdateBudgetModal";
import { BudgetCard } from "./components/BudgetCard";
import type { Budget } from "./components/columns";
import { budgetsApi } from "@/lib/api-client";
import { toast } from "sonner";

export default function BudgetsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setIsLoading(true);
        const response = await budgetsApi.getBudgets();
        setBudgets(response.data);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
        toast.error("Failed to fetch budgets. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, [refreshTrigger]);

  const currentMonthBudget = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentDateStr = `${currentYear}-${currentMonth}`;

    // First try to find current month's budget
    const currentMonthBudget = budgets.find(b => b.month === currentDateStr);
    if (currentMonthBudget) return currentMonthBudget;

    // Then try to find any future budget
    const futureBudget = budgets.find(b => b.month >= currentDateStr);
    if (futureBudget) return futureBudget;

    // If no current or future budget, return the most recent past budget
    return budgets.length > 0 ? budgets.sort((a, b) => b.month.localeCompare(a.month))[0] : null;
  }, [budgets]);

  const handleAddBudget = async (data: { amount: number; month: string; year: string }) => {
    try {
      const response = await budgetsApi.createBudget(data);
      setBudgets(prevBudgets => [...prevBudgets, response.data]);
      setIsAddModalOpen(false);
      toast.success("Budget created successfully");
    } catch (error) {
      console.error("Failed to create budget:", error);
      toast.error("Failed to create budget. Please try again.");
    }
  };

  const handleUpdateBudget = async (id: string, data: { amount: number }) => {
    try {
      const response = await budgetsApi.updateBudget(id, data);
      const updatedBudget = response.data;
      
      const spent = updatedBudget.spent || 0;
      const remaining = updatedBudget.amount - spent;
      
      const completeBudget = {
        ...updatedBudget,
        spent,
        remaining
      };

      setBudgets(prevBudgets => 
        prevBudgets.map(budget => 
          budget.id === id ? completeBudget : budget
        )
      );
      setIsUpdateModalOpen(false);
      toast.success("Budget updated successfully");
    } catch (error) {
      console.error("Failed to update budget:", error);
      toast.error("Failed to update budget. Please try again.");
    }
  };

  const handleBudgetDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {currentMonthBudget && (
        <BudgetCard 
          budget={currentMonthBudget}
          onUpdateClick={(budget) => {
            setSelectedBudget(budget);
            setIsUpdateModalOpen(true);
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <BudgetTable 
              budgets={budgets}
              onRowClick={(budget) => {
                setSelectedBudget(budget);
                setIsUpdateModalOpen(true);
              }}
              onBudgetDeleted={handleBudgetDeleted}
            />
          </div>
        </CardContent>
      </Card>

      <AddBudgetModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddBudget}
      />
      
      <UpdateBudgetModal 
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        budget={selectedBudget}
        onSubmit={handleUpdateBudget}
      />
    </div>
  );
} 