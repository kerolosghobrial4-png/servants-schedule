import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "md" | "lg" | "sm";

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string) {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-[4px] font-display font-semibold uppercase tracking-[0.08em] transition-colors select-none disabled:opacity-50 disabled:pointer-events-none",
    size === "lg" && "min-h-14 px-6 text-lg",
    size === "md" && "min-h-12 px-5 text-[0.95rem]",
    size === "sm" && "min-h-9 px-3 text-[0.8rem]",
    variant === "primary" && "bg-red text-ink hover:bg-red-bright active:bg-red",
    variant === "secondary" && "border border-line-strong text-ink hover:border-ink",
    variant === "ghost" && "text-muted hover:text-ink",
    variant === "danger" && "border border-red/60 text-red-bright hover:bg-red-deep",
    extra,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/** Small uppercase heading followed by a hairline — the main section divider. */
export function SectionHeading({
  children,
  action,
  className,
}: {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex items-end justify-between gap-4 border-b border-line pb-2 mb-4", className)}>
      <h2 className="label text-ink">{children}</h2>
      {action}
    </div>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow?: ReactNode; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="label mb-2">{eyebrow}</p>}
      <h1 className="display text-4xl sm:text-5xl">{title}</h1>
      {children && <div className="mt-3 text-muted max-w-2xl">{children}</div>}
    </header>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "ink",
  size = "md",
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "ink" | "red" | "gold";
  size?: "md" | "lg";
}) {
  return (
    <div>
      <div
        className={cx(
          "numeral",
          size === "lg" ? "text-6xl sm:text-7xl" : "text-4xl sm:text-5xl",
          tone === "red" && "text-red-bright",
          tone === "gold" && "text-gold",
        )}
      >
        {value}
      </div>
      <div className="label mt-2">{label}</div>
      {sub && <div className="text-sm text-dim mt-1">{sub}</div>}
    </div>
  );
}

export function Tag({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "red" | "gold" | "green" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-[3px] px-1.5 py-0.5 font-display text-[0.72rem] font-semibold uppercase tracking-[0.1em]",
        tone === "muted" && "bg-raised-2 text-muted",
        tone === "red" && "bg-red-deep text-red-bright",
        tone === "gold" && "bg-gold/15 text-gold",
        tone === "green" && "bg-green-deep text-green",
      )}
    >
      {children}
    </span>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" | "success" }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx(
        "border-l-2 pl-3 py-2 text-sm",
        tone === "info" && "border-gold text-muted",
        tone === "error" && "border-red-bright text-ink bg-red-deep/40",
        tone === "success" && "border-green text-ink bg-green-deep/50",
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="py-10 text-center">
      <p className="display text-xl text-muted">{title}</p>
      {children && <div className="mt-2 text-sm text-dim">{children}</div>}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-dim">{hint}</p>}
      {error && <p className="text-xs text-red-bright">{error}</p>}
    </div>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cx("field", props.className)} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={cx("field min-h-24", props.className)} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={cx("field appearance-none bg-raised pr-8", props.className)} />;
}

export function Checkbox({ label, hint, ...props }: ComponentProps<"input"> & { label: ReactNode; hint?: ReactNode }) {
  return (
    <label className="flex items-start gap-3 py-2 cursor-pointer">
      <input type="checkbox" {...props} className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-red)]" />
      <span>
        <span className="block">{label}</span>
        {hint && <span className="block text-xs text-dim">{hint}</span>}
      </span>
    </label>
  );
}

export function formatPoints(n: number, signed = false) {
  const s = Math.abs(n).toLocaleString("en-US");
  if (!signed) return n < 0 ? `−${s}` : s;
  return n < 0 ? `−${s}` : `+${s}`;
}

export function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
