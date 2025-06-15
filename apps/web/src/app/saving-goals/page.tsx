"use client";

import { useState } from "react";
import { SavingGoalCard } from "./components/SavingGoalCard";
import { AddSavingGoal } from "./components/AddSavingGoal";
import type { SavingGoal } from "@/types/saving-goal";

// Dummy data for demonstration
const initialGoals: SavingGoal[] = [
  {
    id: "1",
    name: "New Car",
    targetAmount: 25000,
    currentAmount: 15000,
    targetDate: "2024-12-31",
    isCompleted: false,
  },
  {
    id: "2",
    name: "Vacation Fund",
    targetAmount: 5000,
    currentAmount: 5000,
    targetDate: "2024-06-30",
    isCompleted: true,
  },
  {
    id: "3",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 7500,
    targetDate: "2024-09-30",
    isCompleted: false,
  },
];

export default function SavingGoalsPage() {
  const [goals, setGoals] = useState<SavingGoal[]>(initialGoals);

  const handleAddGoal = (name: string, targetAmount: number) => {
    const newGoal: SavingGoal = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      targetAmount,
      currentAmount: 0,
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      isCompleted: false,
    };
    setGoals([...goals, newGoal]);
  };

  const handleUpdateAmount = (id: string, newAmount: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          const isCompleted = newAmount >= goal.targetAmount;
          return { ...goal, currentAmount: newAmount, isCompleted };
        }
        return goal;
      })
    );
  };

  const activeGoals = goals.filter((goal) => !goal.isCompleted);
  const completedGoals = goals.filter((goal) => goal.isCompleted);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Saving Goals</h1>
        <AddSavingGoal onAddGoal={handleAddGoal} />
      </div>
      
      <div className="space-y-8">
        {activeGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeGoals.map((goal) => (
                <SavingGoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdateAmount={handleUpdateAmount}
                />
              ))}
            </div>
          </div>
        )}

        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Completed Goals</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedGoals.map((goal) => (
                <SavingGoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdateAmount={handleUpdateAmount}
                />
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No saving goals yet. Click the "Add Goal" button to create one.
          </div>
        )}
      </div>
    </div>
  );
} 