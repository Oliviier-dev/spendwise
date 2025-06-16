import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import type { Transaction } from "@/types/transaction";
import { toast } from "sonner";
import { SERVER_URL } from "@/config";
import { formatCurrency } from "@/lib/utils";

interface EditTransactionModalProps {
  transaction: Transaction;
  onTransactionUpdated: () => void;
  categories: string[];
  trigger?: React.ReactNode;
}

type FormData = {
  description: string;
  amount: string;
  type: "expense" | "income";
  category: string;
  date: string;
};

export function EditTransactionModal({
  transaction,
  onTransactionUpdated,
  categories,
  trigger,
}: EditTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    description: transaction.description,
    amount: formatCurrency(transaction.amount),
    type: transaction.type,
    category: transaction.category,
    date: new Date(transaction.date).toISOString().split("T")[0],
  });

  useEffect(() => {
    if (open) {
      setFormData({
        description: transaction.description,
        amount: formatCurrency(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        date: new Date(transaction.date).toISOString().split("T")[0],
      });
    }
  }, [open, transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      
      const response = await fetch(`${SERVER_URL}/api/transactions/${transaction.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Transaction updated successfully");
        onTransactionUpdated();
        setOpen(false);
      } else {
        toast.error(data.message || "Failed to update transaction");
      }
    } catch (error) {
      toast.error("Failed to update transaction");
      console.error("Error updating transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => {
                if (value === "income" || value === "expense") {
                  setFormData({ ...formData, type: value });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Update Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 