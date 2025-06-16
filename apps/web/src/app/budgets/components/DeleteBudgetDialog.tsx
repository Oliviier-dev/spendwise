import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { budgetsApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

interface Budget {
  id: string;
  amount: number;
  spent: number;
  remaining: number;
  month: string;
  year: string;
}

interface DeleteBudgetDialogProps {
  budget: Budget;
  onBudgetDeleted: () => void;
  trigger?: React.ReactNode;
}

export function DeleteBudgetDialog({
  budget,
  onBudgetDeleted,
  trigger,
}: DeleteBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await budgetsApi.deleteBudget(budget.id);
      toast.success("Budget deleted successfully");
      onBudgetDeleted();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete budget");
      console.error("Error deleting budget:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100">
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Budget</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this budget? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/20">
            <div><strong>Month:</strong> {formatMonth(`${budget.month}`)}</div>
            <div><strong>Budget Amount:</strong> ${formatCurrency(budget.amount)}</div>
            <div><strong>Spent:</strong> ${formatCurrency(budget.spent)}</div>
            <div><strong>Remaining:</strong> ${formatCurrency(budget.remaining)}</div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete Budget"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 