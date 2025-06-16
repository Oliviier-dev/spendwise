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
import type { Transaction } from "@/types/transaction";
import { toast } from "sonner";
import { SERVER_URL } from "@/config";
import { formatCurrency } from "@/lib/utils";

interface DeleteTransactionDialogProps {
  transaction: Transaction;
  onTransactionDeleted: () => void;
  trigger?: React.ReactNode;
}

export function DeleteTransactionDialog({
  transaction,
  onTransactionDeleted,
  trigger,
}: DeleteTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/transactions/${transaction.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Transaction deleted successfully");
        onTransactionDeleted();
        setOpen(false);
      } else {
        toast.error(data.message || "Failed to delete transaction");
      }
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error("Error deleting transaction:", error);
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
          <DialogTitle>Delete Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border rounded-md p-4 bg-muted/20">
            <div><strong>Description:</strong> {transaction.description}</div>
            <div><strong>Amount:</strong> {formatCurrency(transaction.amount)}</div>
            <div><strong>Type:</strong> {transaction.type}</div>
            <div><strong>Category:</strong> {transaction.category}</div>
            <div><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete Transaction"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 