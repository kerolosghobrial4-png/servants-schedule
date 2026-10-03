import Link from "next/link";
import { buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col">
      <div className="h-1 bg-red" />
      <div className="flex-1 w-full max-w-md mx-auto px-5 py-20">
        <p className="label text-red-bright mb-3">404</p>
        <h1 className="display text-5xl mb-3">Page not found</h1>
        <p className="text-muted mb-8">That page doesn&apos;t exist, or you don&apos;t have access to it.</p>
        <Link href="/" className={buttonClass("primary", "lg")}>
          Go home
        </Link>
      </div>
    </main>
  );
}
