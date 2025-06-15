import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BudgetData {
  date: string;
  budget: number;
  spent: number;
}

interface BudgetChartProps {
  data: BudgetData[];
}

export function BudgetChart({ data }: BudgetChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#2563eb"
                name="Budget"
              />
              <Line
                type="monotone"
                dataKey="spent"
                stroke="#dc2626"
                name="Spent"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 