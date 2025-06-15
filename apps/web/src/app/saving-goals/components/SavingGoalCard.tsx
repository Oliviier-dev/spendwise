import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { SavingGoal } from "@/types/saving-goal";

interface SavingGoalCardProps {
  goal: SavingGoal;
  onUpdateAmount: (id: string, newAmount: number) => void;
}

export function SavingGoalCard({ goal, onUpdateAmount }: SavingGoalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(goal.currentAmount.toString());
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAmount);
    if (!isNaN(amount) && amount >= 0) {
      onUpdateAmount(goal.id, amount);
      setIsEditing(false);
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Target Amount</p>
            <p className="text-xl font-semibold">${goal.targetAmount.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Amount</p>
            <p className="text-xl font-semibold">${goal.currentAmount.toFixed(2)}</p>
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
                />
                <Button type="submit" size="sm">Save</Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
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