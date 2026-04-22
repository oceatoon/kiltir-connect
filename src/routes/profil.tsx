import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { PageShell, PageHero } from "@/components/page-shell";
import {
  MOCK_WALLET,
  MOCK_ORDERS_CONSUMER,
  STATUS_LABEL,
  AVATAR_USER,
  type WalletEntry,
} from "@/lib/mock-data";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — Kiltir Vrak" },
      { name: "description", content: "Profil personnel : portefeuille, crédit, historique des commandes et statistiques." },
      { property: "og:title", content: "Mon profil — Kiltir Vrak" },
      { property: "og:description", content: "Gère ton crédit personnel et suis tes commandes." },
    ],
  }),
  component: ProfilPage,
});

const PROFILE = {
  name: "Marie Bellec",
  handle: "marie.b",
  email: "marie.b@kiltir.bzh",
  pd: "PD Morlaix Halles",
  joined: "2025-09-12",
};

const creditSchema = z.object({
  amount: z
    .number({ message: "Montant requis" })
    .positive("Doit être > 0")
    .max(2000, "Maximum 2 000 € par opération"),
  method: z.enum(["cb", "virement", "especes"], { message: "Choisis un moyen" }),
});

const spendSchema = z.object({
  amount: z
    .number({ message: "Montant requis" })
    .positive("Doit être > 0"),
  label: z.string().trim().min(2, "Libellé trop court").max(80, "Maximum 80 caractères"),
});

function ProfilPage() {
  const [entries, setEntries] = useState<WalletEntry[]>(MOCK_WALLET.entries);
  const [balance, setBalance] = useState<number>(MOCK_WALLET.balance);

  // Add credit form
  const [addAmount, setAddAmount] = useState("");
  const [method, setMethod] = useState<"cb" | "virement" | "especes">("cb");
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [addOk, setAddOk] = useState<string | null>(null);

  // Spend credit form
  const [spendAmount, setSpendAmount] = useState("");
  const [spendLabel, setSpendLabel] = useState("");
  const [spendErrors, setSpendErrors] = useState<Record<string, string>>({});
  const [spendOk, setSpendOk] = useState<string | null>(null);

  const orders = MOCK_ORDERS_CONSUMER;

  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + o.amount, 0);
    const avg = orders.length ? total / orders.length : 0;
    const active = orders.filter((o) => o.status !== "reception" && o.status !== "annulee").length;
    const recharged = entries
      .filter((e) => e.type === "recharge")
      .reduce((s, e) => s + e.amount, 0);
    const spent = entries
      .filter((e) => e.amount < 0)
      .reduce((s, e) => s + Math.abs(e.amount), 0);
    return { total, avg, active, recharged, spent, count: orders.length };
  }, [orders, entries]);

  const onAddCredit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddOk(null);
    const parsed = creditSchema.safeParse({
      amount: addAmount === "" ? undefined : Number(addAmount),
      method,
    });
    if (!parsed.success) {
      const f: Record<string, string> = {};
      for (const i of parsed.error.issues) f[i.path.join(".")] = i.message;
      setAddErrors(f);
      return;
    }
    setAddErrors({});
    const amt = parsed.data.amount;
    const labelMap = { cb: "Carte bancaire", virement: "Virement", especes: "Espèces (PD)" };
    const entry: WalletEntry = {
      id: `W-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toISOString().slice(0, 10),
      label: `Recharge — ${labelMap[parsed.data.method]}`,
      type: "recharge",
      amount: amt,
    };
    setEntries((prev) => [entry, ...prev]);
    setBalance((b) => +(b + amt).toFixed(2));
    setAddAmount("");
    setAddOk(`+${amt.toFixed(2)} € ajoutés à ton crédit (mock).`);
  };

  const onSpend = (e: React.FormEvent) => {
    e.preventDefault();
    setSpendOk(null);
    const parsed = spendSchema.safeParse({
      amount: spendAmount === "" ? undefined : Number(spendAmount),
      label: spendLabel,
    });
    if (!parsed.success) {
      const f: Record<string, string> = {};
      for (const i of parsed.error.issues) f[i.path.join(".")] = i.message;
      setSpendErrors(f);
      return;
    }
    if (parsed.data.amount > balance) {
      setSpendErrors({ amount: `Crédit insuffisant (max ${balance.toFixed(2)} €)` });
      return;
    }
    setSpendErrors({});
    const entry: WalletEntry = {
      id: `W-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toISOString().slice(0, 10),
      label: parsed.data.label,
      type: "paiement",
      amount: -parsed.data.amount,
    };
    setEntries((prev) => [entry, ...prev]);
    setBalance((b) => +(b - parsed.data.amount).toFixed(2));
    setSpendAmount("");
    setSpendLabel("");
    setSpendOk(`-${parsed.data.amount.toFixed(2)} € débités (mock).`);
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Profil"
        title="Salut, Marie."
        intro="Ton portefeuille, tes commandes, tes habitudes. Tout au même endroit."
      />

      {/* Identity card */}
      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <div className="grid md:grid-cols-[auto_1fr_auto] gap-0 border-2 border-foreground">
          <div className="md:border-r-2 border-b-2 md:border-b-0 border-foreground bg-foreground overflow-hidden">
            <img
              src={AVATAR_USER}
              alt={PROFILE.name}
              width={512}
              height={512}
              className="w-full h-full object-cover md:w-48 md:h-full"
            />
          </div>
          <div className="p-8 md:border-r-2 border-b-2 md:border-b-0 border-foreground">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Membre depuis {PROFILE.joined}
            </div>
            <div className="display text-4xl mt-2">{PROFILE.name}</div>
            <div className="font-mono text-sm mt-2 text-muted-foreground">
              @{PROFILE.handle} · {PROFILE.email}
            </div>
            <div className="mt-4 inline-block border-2 border-foreground px-3 py-1 font-mono text-xs uppercase tracking-widest bg-card">
              {PROFILE.pd}
            </div>
          </div>
          <div className="p-8 bg-signal text-signal-foreground flex flex-col justify-center">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-80">
              Crédit disponible
            </div>
            <div className="display text-5xl mt-2">{balance.toFixed(2)} €</div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-80 mt-3">
              Promesses : {MOCK_WALLET.pending.toFixed(2)} €
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-6">▍ Statistiques</div>
        <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-foreground">
          <Stat label="Commandes" value={stats.count.toString()} />
          <Stat label="Total dépensé" value={`${stats.total.toFixed(2)} €`} divider />
          <Stat label="Panier moyen" value={`${stats.avg.toFixed(2)} €`} divider />
          <Stat label="En cours" value={stats.active.toString()} divider highlight />
        </div>
        <div className="grid grid-cols-2 border-2 border-t-0 border-foreground">
          <Stat label="Total rechargé" value={`${stats.recharged.toFixed(2)} €`} />
          <Stat label="Total débité" value={`${stats.spent.toFixed(2)} €`} divider />
        </div>
      </section>

      {/* Credit forms */}
      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-6">▍ Portefeuille</div>
        <div className="grid lg:grid-cols-2 gap-0 border-2 border-foreground">
          {/* Add credit */}
          <form onSubmit={onAddCredit} className="p-8 lg:border-r-2 border-b-2 lg:border-b-0 border-foreground space-y-5">
            <h2 className="display text-3xl">Ajouter du crédit</h2>
            <p className="font-mono text-xs text-muted-foreground">
              Recharge ton compte personnel pour passer tes prochaines commandes.
            </p>

            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest">Montant (€)</span>
              <input
                type="number"
                step="0.01"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="50.00"
                className="mt-2 w-full bg-input border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:border-signal focus:bg-background"
              />
              {addErrors.amount && (
                <span className="block mt-1 font-mono text-xs text-destructive">⚠ {addErrors.amount}</span>
              )}
            </label>

            <fieldset>
              <legend className="font-mono text-[10px] uppercase tracking-widest">Moyen de paiement</legend>
              <div className="mt-2 grid grid-cols-3 border-2 border-foreground">
                {(["cb", "virement", "especes"] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`px-3 py-3 font-mono text-xs uppercase tracking-widest border-foreground ${m !== "cb" ? "border-l-2" : ""} ${
                      method === m ? "bg-signal text-signal-foreground" : "bg-card hover:bg-muted"
                    }`}
                  >
                    {m === "cb" ? "Carte" : m === "virement" ? "Virement" : "Espèces"}
                  </button>
                ))}
              </div>
              {addErrors.method && (
                <span className="block mt-1 font-mono text-xs text-destructive">⚠ {addErrors.method}</span>
              )}
            </fieldset>

            <div className="flex gap-2 flex-wrap">
              {[20, 50, 100, 200].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setAddAmount(p.toString())}
                  className="border-2 border-foreground px-3 py-2 font-mono text-xs hover:bg-signal hover:text-signal-foreground"
                >
                  +{p} €
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-signal text-signal-foreground border-2 border-foreground px-6 py-4 font-mono text-sm uppercase tracking-widest brut-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Créditer mon compte →
            </button>
            {addOk && (
              <div className="border-2 border-signal bg-signal/10 px-4 py-3 font-mono text-xs">✓ {addOk}</div>
            )}
          </form>

          {/* Spend credit */}
          <form onSubmit={onSpend} className="p-8 bg-card space-y-5">
            <h2 className="display text-3xl">Consommer du crédit</h2>
            <p className="font-mono text-xs text-muted-foreground">
              Débit manuel (achat sur place au PD, contribution, ajustement).
            </p>

            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest">Libellé</span>
              <input
                value={spendLabel}
                onChange={(e) => setSpendLabel(e.target.value)}
                placeholder="Ex: Achat sur place — Pain campagne"
                className="mt-2 w-full bg-input border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:border-signal focus:bg-background"
              />
              {spendErrors.label && (
                <span className="block mt-1 font-mono text-xs text-destructive">⚠ {spendErrors.label}</span>
              )}
            </label>

            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest">Montant (€)</span>
              <input
                type="number"
                step="0.01"
                value={spendAmount}
                onChange={(e) => setSpendAmount(e.target.value)}
                placeholder="5.20"
                className="mt-2 w-full bg-input border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:border-signal focus:bg-background"
              />
              {spendErrors.amount && (
                <span className="block mt-1 font-mono text-xs text-destructive">⚠ {spendErrors.amount}</span>
              )}
            </label>

            <button
              type="submit"
              className="w-full bg-foreground text-background border-2 border-foreground px-6 py-4 font-mono text-sm uppercase tracking-widest brut-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Débiter →
            </button>
            {spendOk && (
              <div className="border-2 border-foreground bg-muted px-4 py-3 font-mono text-xs">✓ {spendOk}</div>
            )}
          </form>
        </div>
      </section>

      {/* Wallet history */}
      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal">▍ Mouvements de crédit</div>
          <Link to="/wallet" className="font-mono text-xs uppercase tracking-widest underline hover:text-signal">
            Voir tout / Demander virement →
          </Link>
        </div>
        <ul className="border-2 border-foreground divide-y-2 divide-foreground/30">
          {entries.slice(0, 8).map((e) => (
            <li key={e.id} className="px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {e.date} · {e.type}
                </div>
                <div className="font-mono text-sm mt-1">{e.label}</div>
              </div>
              <div className={`font-mono text-sm font-bold whitespace-nowrap ${e.amount > 0 ? "text-signal" : ""}`}>
                {e.amount > 0 ? "+" : ""}
                {e.amount.toFixed(2)} €
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Order history */}
      <section className="px-6 md:px-12 py-12">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal">▍ Historique des commandes</div>
          <Link to="/commandes" className="font-mono text-xs uppercase tracking-widest underline hover:text-signal">
            Gérer mes commandes →
          </Link>
        </div>
        <div className="border-2 border-foreground overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <thead className="bg-foreground text-background">
              <tr>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest">Référence</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest">Date</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest">Producteur</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest">Articles</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest">Statut</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest">Montant</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t-2 border-foreground/30">
                  <td className="px-4 py-3 font-bold">{o.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3">{o.counterparty}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.items}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block border-2 border-foreground px-2 py-1 text-[10px] uppercase tracking-widest bg-card">
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold">{o.amount.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({
  label,
  value,
  divider,
  highlight,
}: {
  label: string;
  value: string;
  divider?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-6 ${divider ? "border-l-2 border-foreground" : ""} ${
        highlight ? "bg-signal text-signal-foreground" : "bg-card"
      }`}
    >
      <div className={`font-mono text-[10px] uppercase tracking-widest ${highlight ? "opacity-80" : "text-muted-foreground"}`}>
        {label}
      </div>
      <div className="display text-3xl mt-2">{value}</div>
    </div>
  );
}
