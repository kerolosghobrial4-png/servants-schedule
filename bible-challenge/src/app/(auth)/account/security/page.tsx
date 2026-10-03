import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/auth/guards";
import { totpUri } from "@/lib/auth/totp";
import { isStaff } from "@/lib/permissions";
import { Notice, buttonClass } from "@/components/ui";
import { startTotpSetupAction } from "../../actions";
import { ConfirmTotpForm, DisableTotpForm } from "./totp-forms";

export const metadata: Metadata = { title: "Account security" };

export default async function SecurityPage(props: PageProps<"/account/security">) {
  const viewer = await requireUser();
  if (!isStaff(viewer.role)) redirect("/profile");
  const sp = await props.searchParams;
  const user = await db.query.users.findFirst({ where: eq(users.id, viewer.id) });
  if (!user) redirect("/login");

  const settingUp = !user.totpEnabled && !!user.totpSecret && sp.setup === "1";
  let qrSvg: string | null = null;
  if (settingUp && user.totpSecret) {
    qrSvg = await QRCode.toString(totpUri(user.totpSecret, user.username), {
      type: "svg",
      margin: 1,
      color: { dark: "#0e0e0f", light: "#f2ede4" },
    });
  }

  return (
    <>
      <p className="label text-red-bright mb-3">Account security</p>
      <h1 className="display text-5xl mb-3">Two-step verification</h1>
      <p className="text-muted mb-6">
        Staff accounts can change points and see student activity, so protect yours with an authenticator app
        (Google Authenticator, Microsoft Authenticator, 1Password, Authy…).
      </p>

      <div className="flex flex-col gap-4 mb-8">
        {sp.required === "1" && !user.totpEnabled && (
          <Notice tone="error">This group requires two-step verification for leaders. Set it up to continue.</Notice>
        )}
        {sp.enabled === "1" && <Notice tone="success">Two-step verification is on. Other devices were signed out.</Notice>}
        {sp.disabled === "1" && <Notice tone="success">Two-step verification is off.</Notice>}
      </div>

      {user.totpEnabled ? (
        <>
          <p className="mb-6">
            Status: <span className="text-green font-semibold">On</span>
          </p>
          <DisableTotpForm />
        </>
      ) : settingUp && qrSvg ? (
        <>
          <ol className="list-decimal pl-5 space-y-2 text-muted mb-6">
            <li>Scan this code with your authenticator app.</li>
            <li>Enter the 6-digit code it shows.</li>
          </ol>
          <div className="w-56 h-56 mb-4 bg-ink p-2" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <p className="text-xs text-dim mb-6 break-all">
            Can&apos;t scan? Enter this key manually: <span className="font-mono text-muted">{user.totpSecret}</span>
          </p>
          <ConfirmTotpForm />
        </>
      ) : (
        <form action={startTotpSetupAction}>
          <button className={buttonClass("primary", "lg", "w-full")}>Set up two-step verification</button>
        </form>
      )}

      <Link href="/admin" className="inline-block mt-10 text-sm text-muted hover:text-ink">
        ← Back to admin
      </Link>
    </>
  );
}
