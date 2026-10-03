"use client";

import { useFormStatus } from "react-dom";
import type { ComponentProps } from "react";
import { buttonClass } from "./ui";

export function SubmitButton({
  children,
  pendingText,
  variant,
  size,
  className,
  confirm,
  ...props
}: ComponentProps<"button"> & {
  pendingText?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "lg" | "sm";
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      aria-busy={pending}
      className={buttonClass(variant, size, className)}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      {...props}
    >
      {pending ? (pendingText ?? "Working…") : children}
    </button>
  );
}
