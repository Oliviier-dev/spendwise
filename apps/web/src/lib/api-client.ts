import { toast } from "sonner";
import type { Transaction } from "@/types/transaction";

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
}; 