"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CONFIG, NAV_ITEMS } from "@/constants";
import { cn } from "@/utils";

import { ModeToggle } from "./mode-toggle";
import WebShare from "./webshare";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              {CONFIG.APP_NAME}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {NAV_ITEMS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
          <WebShare />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
