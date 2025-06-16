import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { SavingGoal } from "@/types/saving-goal";

interface SavingGoalCardProps {
  goal: SavingGoal;
  onUpdateAmount: (id: string, newAmount: number) => Promise<void>;
}

export function SavingGoalCard({ goal, onUpdateAmount }: SavingGoalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(goal.currentAmount.toString());
  const [isUpdating, setIsUpdating] = useState(false);
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAmount);
    if (!isNaN(amount) && amount >= 0) {
      setIsUpdating(true);
      try {
        await onUpdateAmount(goal.id, amount);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update amount:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <Card className={goal.isCompleted ? "opacity-75" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{goal.name}</span>
          {goal.isCompleted && (
            <span className="text-sm font-normal text-green-600">Completed</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Target Amount</span>
            <span className="font-medium">${goal.targetAmount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Amount</span>
            <span className="font-medium">${goal.currentAmount}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {!goal.isCompleted && (
          <div>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="flex-1"
                  disabled={isUpdating}
                />
                <Button type="submit" size="sm" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsEditing(true)}
              >
                Update Amount
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 