export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh flex flex-col">
      <div className="h-1 bg-red" />
      <main className="flex-1 w-full max-w-md mx-auto px-5 py-12 sm:py-20">{children}</main>
    </div>
  );
}
