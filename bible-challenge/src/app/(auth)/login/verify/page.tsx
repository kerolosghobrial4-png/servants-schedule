import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { TotpForm } from "./totp-form";

export const metadata: Metadata = { title: "Verify" };

export default async function VerifyPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  if (!session.mfaPending) redirect("/");
  return (
    <>
      <p className="label text-red-bright mb-3">Two-step verification</p>
      <h1 className="display text-5xl mb-3">Enter your code</h1>
      <p className="text-muted mb-8">Open your authenticator app and enter the 6-digit code for Bible Challenge.</p>
      <TotpForm />
    </>
  );
}
