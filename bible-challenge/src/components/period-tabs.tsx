import Link from "next/link";
import { cx } from "./ui";

export function Tabs({ items, active }: { items: { key: string; label: string; href: string }[]; active: string }) {
  return (
    <nav className="flex gap-1 border-b border-line mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" aria-label="Filter">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          scroll={false}
          aria-current={item.key === active ? "page" : undefined}
          className={cx(
            "shrink-0 px-3 sm:px-4 py-3 font-display font-semibold uppercase tracking-[0.1em] text-sm border-b-2 -mb-px",
            item.key === active ? "border-red text-ink" : "border-transparent text-muted hover:text-ink",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
