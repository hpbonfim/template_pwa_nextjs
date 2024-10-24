"use client";

import { Button } from "@/components/ui/button";

export default function Error() {
  return (
    <div className="grid grow place-content-center gap-4 text-center">
      <h2 className="text-3xl font-bold">Something went wrong!</h2>
      <Button onClick={() => window.location.reload()}>Try again</Button>
    </div>
  );
}
