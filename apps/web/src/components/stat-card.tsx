import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  title: string
  amount: string
  className?: string
  isLoading?: boolean
  showSign?: boolean
}

export function StatCard({ title, amount, className, isLoading, showSign = false }: StatCardProps) {
  const isNegative = amount.startsWith('-');
  const displayAmount = showSign ? amount : amount.replace('-', '');

  return (
    <div className={cn("rounded-lg border bg-card p-6 shadow-sm", className)}>
      <div className="flex flex-col space-y-1.5">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline justify-between">
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <p className={cn(
              "text-2xl font-bold",
              showSign && (isNegative ? "text-red-600" : "text-green-600")
            )}>
              {displayAmount}
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 