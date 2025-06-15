import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  amount: string
  growth: number
  className?: string
}

export function StatCard({ title, amount, growth, className }: StatCardProps) {
  const isPositive = growth >= 0

  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold">{amount}</p>
          <div className={cn(
            "flex items-center text-sm",
            isPositive ? "text-green-600" : "text-red-600"
          )}>
            {isPositive ? (
              <ArrowUpIcon className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4" />
            )}
            {Math.abs(growth)}%
          </div>
        </div>
      </div>
    </div>
  )
} 