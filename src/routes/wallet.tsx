import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageShell, PageHero } from "@/components/page-shell";
import { MOCK_WALLET } from "@/lib/mock-data";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Mon compte — Kiltir Vrak" },
      { name: "description", content: "Solde, historique et virements de la caisse commune Kiltir Vrak." },
      { property: "og:title", content: "Mon compte — Kiltir Vrak" },
      { property: "og:description", content: "Wallet coopératif : solde, promesses et paiements." },
    ],
  }),
  component: WalletPage,
});

const transferSchema = z.object({
  iban: z.string().trim().min(15, "IBAN trop court").max(34, "IBAN trop long").regex(/^[A-Z0-9 ]+$/i, "Caractères IBAN invalides"),
  amount: z.number({ message: "Montant requis" }).positive("Doit être > 0").max(10000, "Maximum 10 000 €"),
  reason: z.string().trim().max(200, "Maximum 200 caractères").optional(),
});

function WalletPage() {
  const { balance, pending, entries } = MOCK_WALLET;
  const [iban, setIban] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    const parsed = transferSchema.safeParse({
      iban,
      amount: amount === "" ? undefined : Number(amount),
      reason: reason || undefined,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    if (parsed.data.amount > balance) {
      setErrors({ amount: `Solde insuffisant (max ${balance.toFixed(2)} €)` });
      return;
    }
    setErrors({});
    setSuccess(`Demande de virement de ${parsed.data.amount.toFixed(2)} € enregistrée (mock).`);
    setAmount("");
    setReason("");
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Caisse commune"
        title="Ton compte. Tes flux."
        intro="Le wallet te montre ce que tu dois, ce que tu as promis, ce qu'il te reste. Pas de banque entre nous — la caisse commune fait le tampon."
      />

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <div className="grid md:grid-cols-3 border-2 border-foreground">
          <div className="p-8 md:border-r-2 border-b-2 md:border-b-0 border-foreground bg-signal text-signal-foreground">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-80">Solde disponible</div>
            <div className="display text-5xl mt-3">{balance.toFixed(2)} €</div>
          </div>
          <div className="p-8 md:border-r-2 border-b-2 md:border-b-0 border-foreground bg-card">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Promesses en cours</div>
            <div className="display text-5xl mt-3">{pending.toFixed(2)} €</div>
          </div>
          <div className="p-8 bg-card">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Recharge minimale</div>
            <div className="display text-5xl mt-3">50 €</div>
          </div>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-0 border-2 border-foreground">
          <div className="p-8 lg:border-r-2 border-b-2 lg:border-b-0 border-foreground">
            <h2 className="display text-3xl">Historique</h2>
            <ul className="mt-6 divide-y-2 divide-foreground/30">
              {entries.map((e) => (
                <li key={e.id} className="py-4 flex items-start justify-between gap-4">
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
          </div>

          <form onSubmit={onSubmit} className="p-8 space-y-5 bg-card">
            <h2 className="display text-3xl">Demander un virement</h2>
            <p className="font-mono text-xs text-muted-foreground">
              Récupère ton solde sur ton compte bancaire. Mock — backend à venir.
            </p>

            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest">IBAN</span>
              <input
                value={iban}
                onChange={(e) => setIban(e.target.value.toUpperCase())}
                placeholder="FR76 ..."
                className="mt-2 w-full bg-input border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:border-signal focus:bg-background"
              />
              {errors.iban && <span className="block mt-1 font-mono text-xs text-destructive">⚠ {errors.iban}</span>}
            </label>

            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest">Montant (€)</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50.00"
                className="mt-2 w-full bg-input border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:border-signal focus:bg-background"
              />
              {errors.amount && <span className="block mt-1 font-mono text-xs text-destructive">⚠ {errors.amount}</span>}
            </label>

            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest">Motif (optionnel)</span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                maxLength={200}
                className="mt-2 w-full bg-input border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:border-signal focus:bg-background"
              />
              {errors.reason && <span className="block mt-1 font-mono text-xs text-destructive">⚠ {errors.reason}</span>}
            </label>

            <button
              type="submit"
              className="w-full bg-signal text-signal-foreground border-2 border-foreground px-6 py-4 font-mono text-sm uppercase tracking-widest brut-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Demander le virement →
            </button>
            {success && (
              <div className="border-2 border-signal bg-signal/10 px-4 py-3 font-mono text-xs">✓ {success}</div>
            )}
          </form>
        </div>
      </section>
    </PageShell>
  );
}
