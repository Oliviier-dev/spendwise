"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionTable } from "./components/TransactionTable";
import { AddTransactionModal } from "./components/AddTransactionModal";
import type { Transaction } from "@/types/transaction";
import { dummyTransactions } from "@/data/dummy-transactions";

const categories = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Education",
  "Personal Care",
  "Gifts",
  "Travel",
  "Other",
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(dummyTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleAddTransaction = (newTransaction: Omit<Transaction, "id">) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([...transactions, transaction]);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || transaction.type === selectedType;
    const matchesCategory =
      !selectedCategory || transaction.category === selectedCategory;
    const matchesDate =
      !dateRange?.from ||
      !dateRange?.to ||
      (new Date(transaction.date) >= dateRange.from &&
        new Date(transaction.date) <= dateRange.to);

    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <AddTransactionModal
          onAddTransaction={handleAddTransaction}
          categories={categories}
        />
      </div>

      <div className="space-y-4">
        <TransactionFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          categories={categories}
        />

        <TransactionTable transactions={filteredTransactions} />
      </div>
    </div>
  );
} 