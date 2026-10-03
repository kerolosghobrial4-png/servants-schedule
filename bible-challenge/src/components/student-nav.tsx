"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, House, ListOrdered, Trophy, UserRound } from "lucide-react";
import { cx } from "./ui";

const ITEMS = [
  { href: "/", label: "Home", icon: House },
  { href: "/quiz", label: "Quiz", icon: BookOpen },
  { href: "/leaderboard", label: "Standings", icon: Trophy },
  { href: "/history", label: "History", icon: ListOrdered },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Desktop: inline top navigation. */
export function StudentTopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden md:flex items-center gap-1">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          className={cx(
            "px-3 py-2 font-display font-semibold uppercase tracking-[0.1em] text-sm border-b-2",
            isActive(pathname, item.href) ? "text-ink border-red" : "text-muted border-transparent hover:text-ink",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** Mobile: thumb-reachable bottom tab bar. */
export function StudentTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-bg/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex flex-col items-center justify-center gap-1 h-16 font-display text-[0.7rem] font-semibold uppercase tracking-[0.08em]",
                  active ? "text-ink" : "text-dim",
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} className={active ? "text-red-bright" : undefined} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
