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
import { savingGoalsApi } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";
import type { SavingGoal } from "@/types/saving-goal";

interface DeleteSavingGoalDialogProps {
  goal: SavingGoal;
  onSavingGoalDeleted: (id: string) => void;
  trigger?: React.ReactNode;
}

export function DeleteSavingGoalDialog({
  goal,
  onSavingGoalDeleted,
  trigger,
}: DeleteSavingGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await savingGoalsApi.deleteSavingGoal(goal.id);
      
      toast.success("Saving goal deleted successfully");
      onSavingGoalDeleted(goal.id);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete saving goal");
      console.error("Error deleting saving goal:", error);
    } finally {
      setLoading(false);
    }
  };

  const progress = (goal.currentAmount / goal.targetAmount) * 100;

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
          <DialogTitle>Delete Saving Goal</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this saving goal? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/20">
            <div><strong>Name:</strong> {goal.name}</div>
            <div><strong>Target Amount:</strong> ${formatCurrency(goal.targetAmount)}</div>
            <div><strong>Current Amount:</strong> ${formatCurrency(goal.currentAmount)}</div>
            <div><strong>Progress:</strong> {progress.toFixed(0)}%</div>
            <div><strong>Target Date:</strong> {formatDate(goal.targetDate)}</div>
            <div><strong>Status:</strong> {goal.isCompleted ? "Completed" : "In Progress"}</div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete Goal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 