"use client";

import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionTable } from "./components/TransactionTable";
import { AddTransactionModal } from "./components/AddTransactionModal";
import type { Transaction } from "@/types/transaction";
import { toast } from "sonner";
import { SERVER_URL } from "@/config";

const categories = [
  "All",
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

const transactionTypes = ["All", "income", "expense"];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_URL}/api/transactions`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.data) {
        setTransactions(data.data);
      } else {
        toast.error(data.message || "Failed to load transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, "id">) => {
    // Refresh the transactions list
    fetchTransactions();
  };

  const handleClearDateRange = () => {
    setDateRange(undefined);
  };

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = transaction.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "All" || transaction.type === selectedType;
      const matchesCategory =
        selectedCategory === "All" || transaction.category === selectedCategory;
      const matchesDate =
        !dateRange?.from ||
        !dateRange?.to ||
        (new Date(transaction.date) >= dateRange.from &&
          new Date(transaction.date) <= dateRange.to);

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <AddTransactionModal
          onAddTransaction={handleAddTransaction}
          categories={categories.filter(cat => cat !== "All")}
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
          onClearDateRange={handleClearDateRange}
          categories={categories}
          transactionTypes={transactionTypes}
        />

        {loading ? (
          <div className="text-center py-8">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">No transactions found. Add your first transaction!</div>
        ) : (
          <TransactionTable transactions={filteredTransactions} />
        )}
      </div>
    </div>
  );
} 