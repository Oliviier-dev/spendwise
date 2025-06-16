"use client";

import type { ColumnDef, SortingFn } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export interface Budget {
  id: string;
  amount: number;
  spent: number;
  remaining: number;
  month: string; // Format: YYYY-MM
  year: string;
}

const numericSort: SortingFn<Budget> = (rowA, rowB, columnId) => {
  const a = parseFloat(rowA.getValue(columnId)) || 0;
  const b = parseFloat(rowB.getValue(columnId)) || 0;
  return a - b;
};

export const columns: ColumnDef<Budget>[] = [
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
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
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
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(spent);
      return <span className="text-red-600">{formatted}</span>;
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
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(remaining);
      return <span className="text-green-600">{formatted}</span>;
    },
    sortingFn: numericSort,
  },
]; 