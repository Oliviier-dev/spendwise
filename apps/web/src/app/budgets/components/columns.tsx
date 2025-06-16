"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Budget = {
  id: string;
  amount: number;
  spent: number;
  remaining: number;
  month: string;
  year: string;
};

export const columns: ColumnDef<Budget>[] = [
  {
    accessorKey: "month",
    header: "Month",
    cell: ({ row }) => {
      const month = row.getValue("month") as string;
      return format(new Date(month), "MMMM yyyy");
    },
  },
  {
    accessorKey: "amount",
    header: "Budget Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
  {
    accessorKey: "spent",
    header: "Spent",
    cell: ({ row }) => {
      const spent = parseFloat(row.getValue("spent"));
      return (
        <span className="text-red-600">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(spent)}
        </span>
      );
    },
  },
  {
    accessorKey: "remaining",
    header: "Remaining",
    cell: ({ row }) => {
      const remaining = parseFloat(row.getValue("remaining"));
      return (
        <span className="text-green-600">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(remaining)}
        </span>
      );
    },
  },
]; 