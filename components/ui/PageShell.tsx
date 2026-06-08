import Link from "next/link";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fffdf8_0,#fbf7ef_34%,#f0e3cf_100%)] text-kompas-ink">
      <header className="sticky top-0 z-20 border-b border-kompas-line/80 bg-kompas-paper/88 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-kompas-ink">
            FamilieKompas
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm text-kompas-muted">
            <Link href="/voorwaarden">Wat we wel en niet doen</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
