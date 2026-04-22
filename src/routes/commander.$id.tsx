import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { PageShell, PageHero } from "@/components/page-shell";
import { CATALOG } from "@/lib/mock-data";

export const Route = createFileRoute("/commander/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Commander ${params.id} — Kiltir Vrak` },
      { name: "description", content: "Engager une promesse de commande sur un produit du catalogue." },
    ],
  }),
  component: CommanderPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="p-12 font-mono">
        Produit introuvable.{" "}
        <Link to="/produits" className="underline">Retour au catalogue</Link>
      </div>
    </PageShell>
  ),
});

function CommanderPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const product = useMemo(() => CATALOG.find((p) => p.id === id), [id]);

  const [qty, setQty] = useState<number>(1);
  const [pd, setPd] = useState<string>(product?.pds[0] ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  if (!product) {
    return (
      <PageShell>
        <div className="p-12 font-mono">
          Produit introuvable.{" "}
          <Link to="/produits" className="underline">Retour au catalogue</Link>
        </div>
      </PageShell>
    );
  }

  const schema = z.object({
    qty: z.number().int().min(1, "Min. 1").max(product.available, `Max. ${product.available}`),
    pd: z.string().min(1, "PD requis"),
    name: z.string().trim().min(2, "Nom requis").max(80),
    email: z.string().trim().email("Email invalide").max(200),
    notes: z.string().max(400).optional(),
    accept: z.literal(true, { error: "Engagement requis" }),
  });

  const total = qty * product.price;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ qty, pd, name, email, notes, accept });
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setDone(true);
  };

  if (done) {
    return (
      <PageShell>
        <section className="px-6 md:px-12 py-24 border-b-2 border-foreground">
          <div className="max-w-2xl border-2 border-foreground p-10 brut-shadow-signal">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal">▍ Promesse enregistrée</div>
            <h1 className="display text-5xl mt-4">Merci, {name.split(" ")[0]}.</h1>
            <p className="mt-6 font-mono text-sm">
              Vous avez réservé <strong>{qty} {product.unit}</strong> de <strong>{product.name}</strong> à retirer en <strong>{pd}</strong>.
              Total engagé : <strong>{total.toFixed(2)} €</strong>. Le débit aura lieu à la confirmation par le producteur.
            </p>
            <div className="mt-8 flex gap-0">
              <Link to="/commandes" className="bg-foreground text-background border-2 border-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest brut-shadow-signal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Voir mes commandes →
              </Link>
              <button
                onClick={() => navigate({ to: "/produits" })}
                className="-ml-[2px] border-2 border-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-signal hover:text-signal-foreground"
              >
                Retour catalogue
              </button>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        eyebrow={`Promesse — ${product.id}`}
        title={product.name}
        intro={`Producteur : ${product.producerName} · ${product.price.toFixed(2)} €/${product.unit} · clôture ${product.closesOn}`}
      />

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_360px] gap-0 border-2 border-foreground">
          <div className="p-8 space-y-8 lg:border-r-2 border-foreground">
            <Field label="Quantité" error={errors.qty}>
              <div className="flex items-stretch border-2 border-foreground w-fit">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 font-mono text-lg hover:bg-signal hover:text-signal-foreground">−</button>
                <input
                  type="number"
                  min={1}
                  max={product.available}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value) || 1)}
                  className="w-24 text-center font-mono text-lg border-x-2 border-foreground bg-background py-2 focus:outline-none"
                />
                <button type="button" onClick={() => setQty((q) => Math.min(product.available, q + 1))} className="px-4 font-mono text-lg hover:bg-signal hover:text-signal-foreground">+</button>
                <span className="px-4 flex items-center font-mono text-xs uppercase tracking-widest">{product.unit}</span>
              </div>
              <div className="font-mono text-[11px] mt-2 opacity-70">
                Disponible : {product.available} {product.unit}
              </div>
            </Field>

            <Field label="Point de distribution" error={errors.pd}>
              <div className="flex flex-wrap gap-0">
                {product.pds.map((x, i) => (
                  <button
                    key={x}
                    type="button"
                    onClick={() => setPd(x)}
                    className={`border-2 ${i > 0 ? "-ml-[2px]" : ""} border-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest ${pd === x ? "bg-signal text-signal-foreground" : "hover:bg-signal hover:text-signal-foreground"}`}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Nom complet" error={errors.name}>
                <BrutInput value={name} onChange={(v) => setName(v)} placeholder="Marie Bellec" />
              </Field>
              <Field label="Email" error={errors.email}>
                <BrutInput type="email" value={email} onChange={(v) => setEmail(v)} placeholder="marie@exemple.bzh" />
              </Field>
            </div>

            <Field label="Notes au producteur (optionnel)" error={errors.notes}>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                maxLength={400}
                className="w-full border-2 border-foreground bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:bg-signal/10"
                placeholder="Allergie, format de découpe, créneau préféré…"
              />
            </Field>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accept}
                onChange={(e) => setAccept(e.target.checked)}
                className="mt-1 size-5 border-2 border-foreground accent-foreground"
              />
              <span className="font-mono text-xs">
                Je m'engage à retirer ma commande au PD choisi et à approvisionner mon compte si besoin.
              </span>
            </label>
            {errors.accept && <p className="font-mono text-xs text-destructive -mt-4">{errors.accept}</p>}
          </div>

          <aside className="p-8 bg-foreground text-background flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal">▍ Récapitulatif</div>
            <div className="mt-4 space-y-3 font-mono text-sm">
              <Row k="Produit" v={product.name} />
              <Row k="Producteur" v={product.producerName} />
              <Row k="Prix unitaire" v={`${product.price.toFixed(2)} €/${product.unit}`} />
              <Row k="Quantité" v={`${qty} ${product.unit}`} />
              <Row k="Retrait" v={pd || "—"} />
            </div>
            <div className="mt-6 pt-6 border-t-2 border-background/30 flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-widest">Total promesse</span>
              <span className="display text-4xl text-signal">{total.toFixed(2)} €</span>
            </div>
            <button
              type="submit"
              className="mt-8 bg-signal text-signal-foreground border-2 border-signal px-6 py-4 font-mono text-xs uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors"
            >
              Confirmer la promesse →
            </button>
            <Link to="/produits" className="mt-3 text-center font-mono text-[11px] uppercase tracking-widest underline underline-offset-4 opacity-70 hover:opacity-100">
              ← Retour catalogue
            </Link>
          </aside>
        </form>
      </section>
    </PageShell>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest mb-2 opacity-70">{label}</div>
      {children}
      {error && <p className="mt-2 font-mono text-xs text-destructive">{error}</p>}
    </div>
  );
}

function BrutInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-2 border-foreground bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:bg-signal/10"
    />
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="opacity-70">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}
