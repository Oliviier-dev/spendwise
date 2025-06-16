"use client";

import type { ColumnDef, SortingFn } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil } from "lucide-react";
import { DeleteBudgetDialog } from "./DeleteBudgetDialog";
import { formatCurrency } from "@/lib/utils";

export interface Budget {
  id: string;
  amount: number;
  spent: number;
  remaining: number;
  month: string; // Format: YYYY-MM
  year: string;
}

interface ColumnProps {
  onBudgetDeleted: () => void;
  onEditClick: (budget: Budget) => void;
}

const numericSort: SortingFn<Budget> = (rowA, rowB, columnId) => {
  const a = parseFloat(rowA.getValue(columnId)) || 0;
  const b = parseFloat(rowB.getValue(columnId)) || 0;
  return a - b;
};

export const createColumns = ({ onBudgetDeleted, onEditClick }: ColumnProps): ColumnDef<Budget>[] => [
  {
    accessorKey: "month",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Month
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const month = row.getValue("month") as string;
      const date = new Date(month + "-01");
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Budget Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return `$${formatCurrency(amount)}`;
    },
    sortingFn: numericSort,
  },
  {
    accessorKey: "spent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const spent = parseFloat(row.getValue("spent")) || 0;
      return <span className="text-red-600">${formatCurrency(spent)}</span>;
    },
    sortingFn: numericSort,
  },
  {
    accessorKey: "remaining",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Remaining
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const spent = parseFloat(row.getValue("spent")) || 0;
      const remaining = amount - spent;
      return <span className="text-green-600">${formatCurrency(remaining)}</span>;
    },
    sortingFn: numericSort,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const budget = row.original;
      
      return (
        <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => onEditClick(budget)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteBudgetDialog 
            budget={budget} 
            onBudgetDeleted={onBudgetDeleted}
          />
        </div>
      );
    },
  }
]; 