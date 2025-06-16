import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { SavingGoal } from "@/types/saving-goal";
import { DeleteSavingGoalDialog } from "./DeleteSavingGoalDialog";
import { formatCurrency } from "@/lib/utils";

interface SavingGoalCardProps {
  goal: SavingGoal;
  onUpdateAmount: (id: string, newAmount: number) => Promise<void>;
  onSavingGoalDeleted: (id: string) => void;
}

export function SavingGoalCard({ 
  goal, 
  onUpdateAmount, 
  onSavingGoalDeleted 
}: SavingGoalCardProps) {
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
          <div className="flex items-center">
            {goal.isCompleted && (
              <span className="text-sm font-normal text-green-600 mr-2">Completed</span>
            )}
            <DeleteSavingGoalDialog 
              goal={goal}
              onSavingGoalDeleted={() => onSavingGoalDeleted(goal.id)}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>${formatCurrency(goal.currentAmount)}</span>
            <span>${formatCurrency(goal.targetAmount)}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{progress.toFixed(0)}%</span>
            <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
          </div>
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