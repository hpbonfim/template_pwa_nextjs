"use client";

import { LINKS } from "@/constants";

export function Footer() {
  return (
    <footer className="container flex flex-col items-center justify-between gap-4 py-6 md:h-24 md:flex-row md:px-8 md:py-0">
      <p className="text-center text-sm leading-loose  md:text-left">
        Built with ❤️ by&nbsp;
        <a
          href={LINKS.LINKEDIN_URL}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          @henriquebonfim
        </a>
        .&nbsp; The source code is available on&nbsp;
        <a
          href={LINKS.GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline underline-offset-4"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  );
}
