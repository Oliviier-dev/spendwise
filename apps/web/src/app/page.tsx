"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">SpendWise</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Take Control of Your <span className="text-primary">Finances</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Track expenses, manage budgets, and achieve your financial goals with SpendWise - the smart way to handle your money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">Get Started Free</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Log in</Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[400px]">
            <Image 
              src="/App data-cuate.svg"
              alt="Financial management"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Financial Insights */}
            <div className="bg-background p-6 rounded-xl shadow-sm border overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Financial Insights</h3>
              </div>
              <p className="mb-4 text-muted-foreground">Real-time visualization of your finances with interactive charts and reports.</p>
              
              <div className="mt-4 h-[100px] flex items-end gap-1">
                <div className="w-1/12 bg-primary h-[30%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[45%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[60%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[40%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[55%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[75%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[65%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[50%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[80%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[70%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[90%] rounded-t"></div>
                <div className="w-1/12 bg-primary h-[60%] rounded-t"></div>
              </div>
            </div>

            {/* Budget Management */}
            <div className="bg-background p-6 rounded-xl shadow-sm border overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Budget Management</h3>
              </div>
              <p className="mb-4 text-muted-foreground">Set and manage your monthly budgets to keep your spending in check.</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Monthly Budget</span>
                    <span>$1,850/$2,500</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{width: '74%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>April 2023</span>
                    <span className="text-green-500">$650 remaining</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{width: '74%'}}></div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>CATEGORY BREAKDOWN</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <div className="text-center p-1">
                      <div className="w-full bg-blue-100 h-8 rounded flex items-center justify-center text-xs font-medium">25%</div>
                      <div className="text-xs mt-1">Housing</div>
                    </div>
                    <div className="text-center p-1">
                      <div className="w-full bg-green-100 h-8 rounded flex items-center justify-center text-xs font-medium">15%</div>
                      <div className="text-xs mt-1">Food</div>
                    </div>
                    <div className="text-center p-1">
                      <div className="w-full bg-yellow-100 h-8 rounded flex items-center justify-center text-xs font-medium">10%</div>
                      <div className="text-xs mt-1">Transport</div>
                    </div>
                    <div className="text-center p-1">
                      <div className="w-full bg-purple-100 h-8 rounded flex items-center justify-center text-xs font-medium">50%</div>
                      <div className="text-xs mt-1">Other</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Tracking */}
            <div className="bg-background p-6 rounded-xl shadow-sm border overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Expense Tracking</h3>
              </div>
              <p className="mb-4 text-muted-foreground">Track all your expenses in one place with easy categorization and notes.</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Grocery Store</div>
                    <div className="text-xs text-muted-foreground">Food</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-500">-$85.20</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Monthly Salary</div>
                    <div className="text-xs text-muted-foreground">Income</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-500">+$3,500.00</div>
                    <div className="text-xs text-muted-foreground">Yesterday</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-medium">Restaurant</div>
                    <div className="text-xs text-muted-foreground">Food</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-500">-$42.75</div>
                    <div className="text-xs text-muted-foreground">Yesterday</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Saving Goals */}
            <div className="bg-background p-6 rounded-xl shadow-sm border overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m4.9 4.9 14.2 14.2"></path>
                    <path d="M12 7v5l2.5 2.5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Saving Goals</h3>
              </div>
              <p className="mb-4 text-muted-foreground">Set saving goals and track your progress towards financial achievements.</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Vacation</span>
                    <span>$2,400/$5,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{width: '48%'}}></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right mt-1">48% complete</div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>New Car</span>
                    <span>$12,000/$30,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right mt-1">40% complete</div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Emergency Fund</span>
                    <span>$8,000/$10,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right mt-1">80% complete</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/signup">
              <Button size="lg">Get Started Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
