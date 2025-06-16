"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Budget } from "./columns";
import { formatCurrency } from "@/lib/utils";

interface UpdateBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: Budget | null;
  onSubmit: (id: string, data: { amount: number }) => Promise<void>;
}

export function UpdateBudgetModal({ open, onOpenChange, budget, onSubmit }: UpdateBudgetModalProps) {
  const [amount, setAmount] = useState(budget?.amount.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset amount when budget changes
  useEffect(() => {
    if (budget) {
      setAmount(formatCurrency(budget.amount));
    }
  }, [budget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || !amount) return;

    setIsSubmitting(true);
    try {
      await onSubmit(budget.id, {
        amount: parseFloat(amount),
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
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
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter budget amount"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Budget"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 