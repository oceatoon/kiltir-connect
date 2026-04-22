import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageShell, PageHero } from "@/components/page-shell";
import { PRODUCERS, CATEGORIES, ALL_PDS } from "@/lib/mock-data";

export const Route = createFileRoute("/produits/nouveau")({
  head: () => ({
    meta: [
      { title: "Proposer un produit — Kiltir Vrak" },
      { name: "description", content: "Producteurs : déclarez un nouveau produit, fixez prix, quantité et zones de distribution." },
    ],
  }),
  component: NouveauProduitPage,
});

const schema = z.object({
  producer: z.string().min(1, "Producteur requis"),
  name: z.string().trim().min(2, "Nom requis").max(80),
  category: z.string().min(1, "Catégorie requise"),
  price: z.number().positive("Prix > 0").max(9999),
  unit: z.string().trim().min(1, "Unité requise").max(20),
  proposed: z.number().int().positive("Quantité > 0").max(100000),
  closesOn: z.string().min(1, "Date requise"),
  pds: z.array(z.string()).min(1, "Au moins 1 PD"),
  description: z.string().trim().min(10, "Min. 10 caractères").max(500),
  accept: z.literal(true, { errorMap: () => ({ message: "Engagement requis" }) }),
});

function NouveauProduitPage() {
  const [producer, setProducer] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<string>("");
  const [unit, setUnit] = useState("kg");
  const [proposed, setProposed] = useState<string>("");
  const [closesOn, setClosesOn] = useState("");
  const [pds, setPds] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const togglePd = (x: string) =>
    setPds((curr) => (curr.includes(x) ? curr.filter((c) => c !== x) : [...curr, x]));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({
      producer,
      name,
      category,
      price: Number(price),
      unit,
      proposed: Number(proposed),
      closesOn,
      pds,
      description,
      accept,
    });
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
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal">▍ Produit publié</div>
            <h1 className="display text-5xl mt-4">{name}</h1>
            <p className="mt-6 font-mono text-sm">
              {proposed} {unit} proposés à {Number(price).toFixed(2)} €/{unit}, distribués sur {pds.length} PD. Promesses ouvertes jusqu'au {closesOn}.
            </p>
            <div className="mt-8 flex gap-0">
              <Link to="/produits" className="bg-foreground text-background border-2 border-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest brut-shadow-signal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Voir le catalogue →
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Producteur — nouveau produit"
        title="Déclarez ce que vous proposez."
        intro="Vous fixez le prix, la quantité, les PD et la date de clôture des promesses. Aucun intermédiaire."
      />

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <form onSubmit={onSubmit} className="max-w-4xl border-2 border-foreground p-8 space-y-8">
          <Field label="Producteur" error={errors.producer}>
            <select
              value={producer}
              onChange={(e) => setProducer(e.target.value)}
              className="w-full border-2 border-foreground bg-background px-3 py-2 font-mono text-sm focus:outline-none"
            >
              <option value="">— Sélectionner —</option>
              {PRODUCERS.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </Field>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Nom du produit" error={errors.name}>
              <BrutInput value={name} onChange={setName} placeholder="Pommes Reinette" />
            </Field>
            <Field label="Catégorie" error={errors.category}>
              <ChipGroup value={category} onChange={setCategory} options={CATEGORIES} />
            </Field>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Field label="Prix (€)" error={errors.price}>
              <BrutInput type="number" value={price} onChange={setPrice} placeholder="2.40" />
            </Field>
            <Field label="Unité" error={errors.unit}>
              <BrutInput value={unit} onChange={setUnit} placeholder="kg, btl, panier…" />
            </Field>
            <Field label="Quantité proposée" error={errors.proposed}>
              <BrutInput type="number" value={proposed} onChange={setProposed} placeholder="180" />
            </Field>
          </div>

          <Field label="Clôture des promesses" error={errors.closesOn}>
            <input
              type="date"
              value={closesOn}
              onChange={(e) => setClosesOn(e.target.value)}
              className="border-2 border-foreground bg-background px-3 py-2 font-mono text-sm focus:outline-none"
            />
          </Field>

          <Field label="Points de distribution" error={errors.pds}>
            <div className="flex flex-wrap gap-0">
              {ALL_PDS.map((x, i) => {
                const active = pds.includes(x);
                return (
                  <button
                    key={x}
                    type="button"
                    onClick={() => togglePd(x)}
                    className={`border-2 ${i > 0 ? "-ml-[2px]" : ""} border-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest ${active ? "bg-signal text-signal-foreground" : "hover:bg-signal hover:text-signal-foreground"}`}
                  >
                    {active ? "✓ " : ""}{x}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Description" error={errors.description}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full border-2 border-foreground bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:bg-signal/10"
              placeholder="Variété, mode de production, conditionnement, conservation…"
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
              Je certifie l'origine et la quantité, et m'engage à livrer aux PD sélectionnés.
            </span>
          </label>
          {errors.accept && <p className="font-mono text-xs text-destructive -mt-4">{errors.accept}</p>}

          <div className="flex gap-0 pt-4 border-t-2 border-foreground">
            <button
              type="submit"
              className="bg-foreground text-background border-2 border-foreground px-8 py-4 font-mono text-xs uppercase tracking-widest brut-shadow-signal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Publier le produit →
            </button>
            <Link
              to="/produits"
              className="-ml-[2px] border-2 border-foreground px-6 py-4 font-mono text-xs uppercase tracking-widest hover:bg-signal hover:text-signal-foreground"
            >
              Annuler
            </Link>
          </div>
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

function ChipGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-0">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`border-2 ${i > 0 ? "-ml-[2px]" : ""} border-foreground px-3 py-2 font-mono text-[11px] uppercase tracking-widest ${value === o ? "bg-signal text-signal-foreground" : "hover:bg-signal hover:text-signal-foreground"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
