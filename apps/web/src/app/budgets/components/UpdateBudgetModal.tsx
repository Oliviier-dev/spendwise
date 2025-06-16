"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdateBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: any;
}

export function UpdateBudgetModal({ open, onOpenChange, budget }: UpdateBudgetModalProps) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (budget) {
      setAmount(budget.amount.toString());
    }
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle budget update
    onOpenChange(false);
  };

  if (!budget) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter budget amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Budget</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 