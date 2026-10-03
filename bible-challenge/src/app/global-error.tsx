"use client";

import "./globals.css";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-dvh max-w-md mx-auto px-5 py-20">
          <h1 className="display text-5xl mb-3">We hit a snag</h1>
          <p className="text-muted mb-8">Please try again in a moment.</p>
          <button onClick={reset} className="bg-red px-5 py-3 font-display uppercase tracking-widest">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
