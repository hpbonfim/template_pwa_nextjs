"use client";

import { type ReactNode } from "react";

import { ThemeProvider } from "next-themes";

import { ToastProvider } from "./ui/toast";

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider />
      {children}
    </ThemeProvider>
  );
}
