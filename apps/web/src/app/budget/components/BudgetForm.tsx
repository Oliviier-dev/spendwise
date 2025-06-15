import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BudgetFormProps {
  currentBudget: number;
  onBudgetUpdate: (newBudget: number) => void;
}

export function BudgetForm({ currentBudget, onBudgetUpdate }: BudgetFormProps) {
  const [budget, setBudget] = useState(currentBudget.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = parseFloat(budget);
    if (!isNaN(newBudget) && newBudget > 0) {
      onBudgetUpdate(newBudget);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget</Label>
            <div className="flex gap-2">
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter your budget"
                className="flex-1"
              />
              <Button type="submit">Update</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 