"use client";

import { MainSidebar } from "@/components/main-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function TransactionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider style={{} as React.CSSProperties} className="flex min-h-screen">
      <div className="flex w-full relative">
        <div className="hidden md:block w-56">
          <MainSidebar />
        </div>
        <main className="flex-1 flex flex-col bg-primary/5 pb-16 md:pb-0">
          <div className="px-4 md:px-[4%] py-6 md:py-10 flex-1">
            <div className="md:hidden mb-4">
              <SidebarTrigger />
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
} 