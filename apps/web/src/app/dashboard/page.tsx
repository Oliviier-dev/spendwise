"use client"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { StatCard } from "@/components/stat-card"

export default function Dashboard() {
  // const router = useRouter();
  // const { data: session, isPending } = authClient.useSession();


  // useEffect(() => {
  //   if (!session && !isPending) {
  //     router.push("/login");
  //   }
  // }, [session, isPending]);

  // if (isPending) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Here's an overview of your financial status
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Current Balance"
          amount="$12,234.00"
          growth={4.2}
        />
        <StatCard
          title="Income"
          amount="$4,500.00"
          growth={2.1}
        />
        <StatCard
          title="Expenses"
          amount="$2,800.00"
          growth={-2.3}
        />
      </div>
    </div>
  );
}
