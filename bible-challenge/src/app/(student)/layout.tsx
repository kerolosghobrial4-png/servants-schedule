import Link from "next/link";
import { db } from "@/db";
import { requireStudent } from "@/lib/auth/guards";
import { getSettings } from "@/server/settings";
import { StudentTabBar, StudentTopNav } from "@/components/student-nav";
import { logoutAction } from "../(auth)/actions";

export default async function StudentLayout({ children }: LayoutProps<"/">) {
  await requireStudent();
  const settings = await getSettings(db);
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-line">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span aria-hidden className="block w-2.5 h-6 bg-red" />
            <span className="display text-lg tracking-[0.06em]">{settings.groupName}</span>
          </Link>
          <StudentTopNav />
          <form action={logoutAction}>
            <button className="label hover:text-ink py-2">Sign out</button>
          </form>
        </div>
      </header>
      <main className="flex-1 w-full mx-auto max-w-5xl px-4 sm:px-6 pt-6 sm:pt-10 pb-28 md:pb-16">{children}</main>
      <StudentTabBar />
    </div>
  );
}
