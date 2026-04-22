import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="border-b-2 border-foreground bg-background px-6 md:px-12 py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
           style={{
             backgroundImage:
               "repeating-linear-gradient(45deg, var(--paper) 0 1px, transparent 1px 14px)",
           }} />
      <div className="relative max-w-6xl">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-6">
          ▍ {eyebrow}
        </div>
        <h1 className="display text-5xl md:text-7xl lg:text-8xl">{title}</h1>
        {intro && (
          <p className="mt-8 max-w-2xl text-lg md:text-xl font-mono text-muted-foreground">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
