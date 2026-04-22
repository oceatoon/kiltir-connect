import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/page-shell";
import { MOCK_ORDERS_CONSUMER, MOCK_ORDERS_PRODUCER, STATUS_LABEL, type Order, type OrderStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/commandes")({
  head: () => ({
    meta: [
      { title: "Mes commandes — Kiltir Vrak" },
      { name: "description", content: "Suivi des promesses, paiements, livraisons et réceptions Kiltir Vrak." },
      { property: "og:title", content: "Mes commandes — Kiltir Vrak" },
      { property: "og:description", content: "Tableau de bord des commandes consommateur et producteur." },
    ],
  }),
  component: CommandesPage,
});

const STATUS_ORDER: OrderStatus[] = ["promesse", "paiement", "livraison", "reception"];

function statusIndex(s: OrderStatus) {
  const i = STATUS_ORDER.indexOf(s);
  return i === -1 ? 0 : i;
}

function CommandesPage() {
  const [side, setSide] = useState<"consommateur" | "producteur">("consommateur");
  const initial = side === "consommateur" ? MOCK_ORDERS_CONSUMER : MOCK_ORDERS_PRODUCER;
  const [orders, setOrders] = useState<Order[]>(initial);

  // Reset orders when switching side (mock — no persistence)
  const switchSide = (next: "consommateur" | "producteur") => {
    setSide(next);
    setOrders(next === "consommateur" ? MOCK_ORDERS_CONSUMER : MOCK_ORDERS_PRODUCER);
  };

  const advance = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id || o.status === "annulee" || o.status === "reception") return o;
        const next = STATUS_ORDER[statusIndex(o.status) + 1] ?? o.status;
        return { ...o, status: next };
      }),
    );
  };

  const cancel = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "annulee" as OrderStatus } : o)));
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Suivi"
        title="Tes commandes, du champ à la main."
        intro="Quatre étapes : promesse, paiement, livraison, réception. Chaque acteur valide la sienne."
      />

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <div className="inline-flex border-2 border-foreground mb-10">
          {(["consommateur", "producteur"] as const).map((s, i) => (
            <button
              key={s}
              onClick={() => switchSide(s)}
              className={`${i === 1 ? "border-l-2 border-foreground" : ""} px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
                side === s ? "bg-signal text-signal-foreground" : "hover:bg-card"
              }`}
            >
              Vue {s}
            </button>
          ))}
        </div>

        <div className="border-2 border-foreground divide-y-2 divide-foreground">
          {orders.map((o) => (
            <article key={o.id} className="p-6 grid lg:grid-cols-[1fr_auto] gap-6 items-start">
              <div className="space-y-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {o.id} · {o.date}
                  </span>
                  <span
                    className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest border-2 ${
                      o.status === "annulee"
                        ? "border-destructive text-destructive"
                        : o.status === "reception"
                          ? "bg-signal text-signal-foreground border-signal"
                          : "border-foreground"
                    }`}
                  >
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>
                <div className="display text-2xl">{o.counterparty}</div>
                <div className="font-mono text-sm text-muted-foreground">{o.items}</div>
                <div className="font-mono text-sm">{o.amount.toFixed(2)} €</div>

                {/* Progress strip */}
                <div className="grid grid-cols-4 gap-0 border-2 border-foreground max-w-md">
                  {STATUS_ORDER.map((s) => {
                    const reached =
                      o.status !== "annulee" && statusIndex(o.status) >= statusIndex(s);
                    return (
                      <div
                        key={s}
                        className={`px-2 py-2 font-mono text-[10px] uppercase tracking-widest text-center border-r-2 last:border-r-0 border-foreground ${
                          reached ? "bg-signal text-signal-foreground" : "bg-card text-muted-foreground"
                        }`}
                      >
                        {STATUS_LABEL[s]}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
                {o.status !== "reception" && o.status !== "annulee" && (
                  <button
                    onClick={() => advance(o.id)}
                    className="bg-foreground text-background border-2 border-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-signal hover:text-signal-foreground transition-colors"
                  >
                    {side === "producteur" && o.status === "promesse"
                      ? "Confirmer →"
                      : side === "producteur" && o.status === "paiement"
                        ? "Marquer livré →"
                        : side === "consommateur" && o.status === "livraison"
                          ? "J'ai reçu ✓"
                          : side === "consommateur" && o.status === "promesse"
                            ? "Payer →"
                            : "Étape suivante →"}
                  </button>
                )}
                {o.status !== "annulee" && o.status !== "reception" && (
                  <button
                    onClick={() => cancel(o.id)}
                    className="border-2 border-destructive text-destructive px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    {side === "producteur" ? "Refuser ✕" : "Annuler ✕"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-widest opacity-60">
          ⚠ Démonstration — actions locales sans persistance.
        </p>
      </section>
    </PageShell>
  );
}
