"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "./ui";

export type AdminNavItem = { href: string; label: string; badge?: number };

function active(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="hidden lg:block w-52 shrink-0">
      <ul className="sticky top-6 flex flex-col">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active(pathname, item.href) ? "page" : undefined}
              className={cx(
                "flex items-center justify-between py-2 pl-3 border-l-2 font-display font-semibold uppercase tracking-[0.1em] text-sm",
                active(pathname, item.href) ? "border-red text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {item.label}
              {!!item.badge && <span className="numeral text-gold text-base">{item.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Mobile: horizontally scrolling section bar under the header. */
export function AdminTopNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="lg:hidden border-b border-line overflow-x-auto">
      <ul className="flex px-2">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <Link
              href={item.href}
              aria-current={active(pathname, item.href) ? "page" : undefined}
              className={cx(
                "flex items-center gap-1.5 px-3 py-3 border-b-2 -mb-px font-display font-semibold uppercase tracking-[0.1em] text-sm",
                active(pathname, item.href) ? "border-red text-ink" : "border-transparent text-muted",
              )}
            >
              {item.label}
              {!!item.badge && <span className="numeral text-gold">{item.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
