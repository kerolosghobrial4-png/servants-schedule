import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { homeFor } from "@/lib/auth/guards";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await getCurrentSession();
  if (session && !session.mfaPending) redirect(homeFor(session.user.role));

  return (
    <>
      <p className="label text-red-bright mb-3">Daily Bible Study</p>
      <h1 className="display text-6xl mb-2">Bible<br />Challenge</h1>
      <p className="text-muted mb-10">Sign in with the username your leader gave you.</p>
      <LoginForm />
      <p className="text-sm text-dim mt-10">Forgot your password? Ask your leader to reset it.</p>
    </>
  );
}
