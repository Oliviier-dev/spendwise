import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BudgetSummaryCardProps {
  budgetSet: number;
  spent: number;
  remaining: number;
}

export function BudgetSummaryCard({
  budgetSet,
  spent,
  remaining,
}: BudgetSummaryCardProps) {
  const progress = (spent / budgetSet) * 100;
  const progressColor = progress > 90 ? "bg-red-500" : progress > 75 ? "bg-yellow-500" : "bg-green-500";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Budget Set</p>
            <p className="text-2xl font-bold">${budgetSet.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="text-2xl font-bold text-red-600">${spent.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-2xl font-bold text-green-600">${remaining.toFixed(2)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className={progressColor} />
        </div>
      </CardContent>
    </Card>
  );
} 