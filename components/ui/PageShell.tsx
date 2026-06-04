import Link from "next/link";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-kompas-cream">
      <header className="border-b border-kompas-line bg-kompas-paper/85">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            FamilieKompas
          </Link>
          <nav className="flex items-center gap-4 text-sm text-kompas-muted">
            <Link href="/voorwaarden">Grenzen</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
