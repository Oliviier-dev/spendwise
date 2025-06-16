import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency to remove unnecessary decimal places for whole numbers
 * e.g. 100.00 becomes 100, but 100.50 remains 100.50
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num % 1 === 0 ? num.toString() : num.toFixed(2);
}
