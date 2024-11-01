"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CONFIG } from "@/constants";

export default function Page() {
  return (
    <main className="grid grow place-content-center gap-4 text-center">
      <h1 className="text-5xl font-bold leading-tight tracking-tighter">
        {CONFIG.APP_DEFAULT_TITLE}
      </h1>
      <div>
        <Button variant="link" asChild>
          <Link href="/posts">See some posts</Link>
        </Button>
        <Button variant="link" asChild>
          <Link href="/geolocation">Geolocation API</Link>
        </Button>
        <Button variant="link" asChild>
          <Link href="/streaming">Stream API</Link>
        </Button>
        <Button variant="link" asChild>
          <Link href="/file-system">File System</Link>
        </Button>
      </div>
    </main>
  );
}
