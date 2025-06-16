import { toast } from "sonner";
import type { Transaction } from "@/types/transaction";
import type { SavingGoal } from "@/types/saving-goal";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(data.message || "An error occurred");
  }
  
  return data;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error occurred");
  }
}

export const authApi = {
  signIn: async (email: string, password: string) => {
    return apiRequest<{ token: string }>("/api/auth/sign-in", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  signUp: async (email: string, password: string, name: string) => {
    return apiRequest<{ token: string }>("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },
};

export const transactionsApi = {
  createTransaction: async (transaction: Omit<Transaction, "id">) => {
    return apiRequest<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    });
  },
  
  getTransactions: async () => {
    return apiRequest<Transaction[]>("/api/transactions", {
      method: "GET",
    });
  },
  
  updateTransaction: async (id: string, transaction: Partial<Omit<Transaction, "id">>) => {
    return apiRequest<Transaction>(`/api/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(transaction),
    });
  },
  
  deleteTransaction: async (id: string) => {
    return apiRequest(`/api/transactions/${id}`, {
      method: "DELETE",
    });
  },
};

export const savingGoalsApi = {
  createSavingGoal: async (data: Omit<SavingGoal, "id" | "createdAt" | "updatedAt">) => {
    return apiRequest<SavingGoal>("/api/saving-goals", {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
    });
  },

  getSavingGoals: async () => {
    return apiRequest<SavingGoal[]>("/api/saving-goals", {
      method: "GET",
      credentials: "include",
    });
  },

  updateSavingGoal: async (id: string, data: Partial<SavingGoal>) => {
    return apiRequest<SavingGoal>(`/api/saving-goals/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(data),
    });
  },
  
  deleteSavingGoal: async (id: string) => {
    return apiRequest(`/api/saving-goals/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};

export const budgetsApi = {
  getBudgets: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/budgets`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch budgets");
    }
    return response.json();
  },

  createBudget: async (data: { amount: number; month: string; year: string }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/budgets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create budget");
    }
    return response.json();
  },

  updateBudget: async (id: string, data: { amount: number }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/budgets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update budget");
    }
    return response.json();
  },
  
  deleteBudget: async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/budgets/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to delete budget");
    }
    return response.json();
  },
};

export const statsApi = {
  getOverview: async (params: { startDate: string; endDate: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stats?${new URLSearchParams({
        type: 'overview',
        startDate: params.startDate,
        endDate: params.endDate,
      })}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch overview stats");
    }

    return response.json();
  },

  getExpensesByCategory: async (params: { startDate: string; endDate: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stats?${new URLSearchParams({
        type: 'category',
        startDate: params.startDate,
        endDate: params.endDate,
      })}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch category expenses");
    }

    return response.json();
  },

  getMonthlyTrends: async (params: { startDate: string; endDate: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stats?${new URLSearchParams({
        type: 'monthly',
        startDate: params.startDate,
        endDate: params.endDate,
      })}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch monthly trends");
    }

    return response.json();
  },
}; 