"use client";

import {LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden h-full flex-col bg-muted p-8 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            SpendWise
          </div>
          <div className="relative z-20 flex-1 flex items-center justify-center">
            <Image
              src="/Time management-amico.svg"
              alt="Time Management"
              width={180}
              height={180}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="relative z-20">
            <blockquote className="space-y-1">
              <p className="text-sm">
                &ldquo;Take control of your finances with SpendWise - your personal finance companion for smarter spending and better saving.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
        <div className="flex h-full items-center justify-center p-8">
          <div className="w-full max-w-[350px] space-y-4">
            <div className="flex flex-col space-y-1 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose a way to continue
              </p>
            </div>
            <LoginForm onSwitchToSignUp={() => router.push("/signup")} />
            <p className="text-center text-xs text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
