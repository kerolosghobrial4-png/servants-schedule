"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-dvh flex flex-col">
      <div className="h-1 bg-red" />
      <div className="flex-1 w-full max-w-md mx-auto px-5 py-20">
        <p className="label text-red-bright mb-3">Something went wrong</p>
        <h1 className="display text-5xl mb-3">We hit a snag</h1>
        <p className="text-muted mb-8">
          Your points and answers are safe. Try again, and if it keeps happening let a leader know
          {error.digest ? (
            <>
              {" "}
              (reference <span className="font-mono text-ink">{error.digest}</span>)
            </>
          ) : null}
          .
        </p>
        <div className="flex gap-3">
          <button onClick={reset} className={buttonClass("primary", "lg")}>
            Try again
          </button>
          <Link href="/" className={buttonClass("secondary", "lg")}>
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
