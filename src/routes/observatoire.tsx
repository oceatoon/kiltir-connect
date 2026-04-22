import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/page-shell";

export const Route = createFileRoute("/observatoire")({
  head: () => ({
    meta: [
      { title: "Observatoire — Kiltir Vrak" },
      { name: "description", content: "Données ouvertes : production consommée, transactions, transports. Transparence totale." },
      { property: "og:title", content: "Observatoire permanent — Kiltir Vrak" },
      { property: "og:description", content: "Tous les flux du circuit court, en clair." },
    ],
  }),
  component: ObservatoirePage,
});

const FAMILIES = [
  { name: "Maraîchage", val: 38, color: "bg-signal" },
  { name: "Boulange", val: 22, color: "bg-foreground" },
  { name: "Élevage", val: 18, color: "bg-destructive" },
  { name: "Boissons", val: 14, color: "bg-muted-foreground" },
  { name: "Transformés", val: 8, color: "bg-card" },
];

const MONTHS = [
  { m: "Mai", v: 38 },
  { m: "Juin", v: 52 },
  { m: "Juil", v: 67 },
  { m: "Août", v: 71 },
  { m: "Sept", v: 84 },
  { m: "Oct", v: 92 },
];

function ObservatoirePage() {
  const max = Math.max(...MONTHS.map((m) => m.v));
  return (
    <PageShell>
      <PageHero
        eyebrow="Données ouvertes — Live"
        title="Tout est public. Tout est compté."
        intro="L'observatoire trace les volumes, les transactions et les kilomètres. Pas de boîte noire."
      />

      <section className="grid grid-cols-2 md:grid-cols-4 border-b-2 border-foreground">
        {[
          { k: "1.4 t", l: "Volume", s: "ce mois" },
          { k: "382", l: "Transactions", s: "ce mois" },
          { k: "47 280 €", l: "Caisse", s: "circulante" },
          { k: "92%", l: "Au", s: "producteur" },
        ].map((s, i) => (
          <div key={i} className={`p-8 ${i < 3 ? "md:border-r-2" : ""} ${i < 2 ? "border-b-2 md:border-b-0" : ""} border-foreground`}>
            <div className="display text-4xl md:text-5xl text-signal">{s.k}</div>
            <div className="mt-3 font-mono text-xs uppercase tracking-widest">{s.l}<br/>{s.s}</div>
          </div>
        ))}
      </section>

      <section className="px-6 md:px-12 py-16 border-b-2 border-foreground">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">
          ▍ Volume mensuel (tonnes)
        </div>
        <h2 className="display text-3xl md:text-4xl mb-12">Croissance organique.</h2>
        <div className="border-2 border-foreground p-8 md:p-12">
          <div className="flex items-end gap-4 md:gap-6 h-64">
            {MONTHS.map((m) => (
              <div key={m.m} className="flex-1 flex flex-col items-center gap-3">
                <div
                  className="w-full bg-signal border-2 border-foreground"
                  style={{ height: `${(m.v / max) * 100}%` }}
                />
                <div className="font-mono text-xs uppercase tracking-widest">{m.m}</div>
                <div className="font-display text-sm">{(m.v / 100).toFixed(2)}t</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 border-b-2 border-foreground bg-card">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-4">
          ▍ Répartition par famille
        </div>
        <h2 className="display text-3xl md:text-4xl mb-12">Ce que mange le réseau.</h2>
        <div className="border-2 border-foreground bg-background">
          <div className="flex h-12">
            {FAMILIES.map((f) => (
              <div
                key={f.name}
                className={`${f.color} border-r-2 last:border-r-0 border-foreground`}
                style={{ width: `${f.val}%` }}
                title={`${f.name} ${f.val}%`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5">
            {FAMILIES.map((f, i) => (
              <div key={f.name} className={`p-4 ${i < FAMILIES.length - 1 ? "md:border-r-2" : ""} border-t-2 border-foreground`}>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 ${f.color} border border-foreground`} />
                  <span className="font-mono text-xs uppercase tracking-widest">{f.name}</span>
                </div>
                <div className="display text-2xl mt-2">{f.val}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
