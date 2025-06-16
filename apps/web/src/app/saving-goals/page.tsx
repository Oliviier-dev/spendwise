"use client";

import { useState, useEffect } from "react";
import { SavingGoalCard } from "./components/SavingGoalCard";
import { AddSavingGoal } from "./components/AddSavingGoal";
import type { SavingGoal } from "@/types/saving-goal";
import { savingGoalsApi } from "@/lib/api-client";

export default function SavingGoalsPage() {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await savingGoalsApi.getSavingGoals();
        if (response.data) {
          setGoals(response.data);
        } else {
          console.error('Error in response:', response.message);
          setError(response.message || "Failed to load saving goals");
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError("Failed to load saving goals");
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const handleAddGoal = async (name: string, targetAmount: number, currentAmount: number, targetDate: string) => {
    try {
      const response = await savingGoalsApi.createSavingGoal({
        name,
        targetAmount,
        currentAmount,
        targetDate,
        isCompleted: false,
      });
      
      if (response.success && response.data) {
        const newGoal = response.data;
        setGoals(prevGoals => [...prevGoals, newGoal]);
      } else {
        console.error('Failed to create saving goal:', response.message);
      }
    } catch (error) {
      console.error('Error creating saving goal:', error);
    }
  };

  const handleUpdateAmount = async (id: string, newAmount: number) => {
    try {
      const response = await savingGoalsApi.updateSavingGoal(id, {
        currentAmount: newAmount
      });
      
      if (response.success && response.data) {
        const updatedGoal = response.data;

        setGoals(goals.map((goal) => {
          return goal.id === id ? updatedGoal : goal;
        }));
      }
    } catch (error) {
      console.error('Failed to update saving goal:', error);
    }
  };


  const goalsWithCompleted = goals.map((goal) => {
    const currentAmount = parseFloat(goal.currentAmount.toString());
    const targetAmount = parseFloat(goal.targetAmount.toString());
    const isCompleted = currentAmount >= targetAmount;
    return {
      ...goal,
      isCompleted
    };
  });

  const activeGoals = goalsWithCompleted.filter((goal) => {
    return !goal.isCompleted;
  });
  const completedGoals = goalsWithCompleted.filter((goal) => {
    return goal.isCompleted;
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Saving Goals</h1>
        <AddSavingGoal onAddGoal={handleAddGoal} />
      </div>
      <div className="space-y-8">
        {loading && <div>Loading...</div>}
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
        {!loading && goals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No saving goals yet. Click the "Add Goal" button to create one.
          </div>
        )}
      </div>
    </div>
  );
} 