import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, PageHero } from "@/components/page-shell";
import { CATALOG, CATEGORIES, ALL_PDS, PRODUCT_IMAGES, type CatalogProduct } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { QuickOrderDialog } from "@/components/quick-order-dialog";

export const Route = createFileRoute("/produits")({
  head: () => ({
    meta: [
      { title: "Produits disponibles — Kiltir Vrak" },
      { name: "description", content: "Catalogue ouvert des produits proposés par les producteurs Kiltir Vrak. Engagez votre promesse." },
      { property: "og:title", content: "Produits disponibles — Kiltir Vrak" },
      { property: "og:description", content: "Promesses de commande sur le catalogue circuit court." },
    ],
  }),
  component: ProduitsPage,
});

function ProduitsPage() {
  const { loggedIn } = useAuth();
  const [quickOrder, setQuickOrder] = useState<CatalogProduct | null>(null);
  const [cat, setCat] = useState<string>("Tous");
  const [pd, setPd] = useState<string>("Tous");

  const filtered = useMemo(
    () =>
      CATALOG.filter(
        (p) =>
          (cat === "Tous" || p.category === cat) &&
          (pd === "Tous" || p.pds.includes(pd)),
      ),
    [cat, pd],
  );

  return (
    <PageShell>
      <PageHero
        eyebrow={`Catalogue — ${CATALOG.length} produits ouverts`}
        title="Ce qui pousse, ce qui se prépare."
        intro="Chaque produit est une promesse en cours. Réservez votre part avant la clôture."
      />

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground space-y-8">
        <div className="space-y-4">
          <FilterRow label="Catégorie" value={cat} setValue={setCat} options={["Tous", ...CATEGORIES]} />
          <FilterRow label="Point de distribution" value={pd} setValue={setPd} options={["Tous", ...ALL_PDS]} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-foreground">
          {filtered.map((p, i) => {
            const pct = Math.round((p.available / p.proposed) * 100);
            return (
              <div
                key={p.id}
                className={`flex flex-col ${i % 3 !== 2 ? "lg:border-r-2" : ""} ${i % 2 === 0 ? "md:border-r-2 lg:border-r-0" : ""} ${i < filtered.length - (filtered.length % 3 || 3) ? "lg:border-b-2" : ""} border-foreground`}
              >
                {PRODUCT_IMAGES[p.id] && (
                  <div className="aspect-[4/3] overflow-hidden border-b-2 border-foreground bg-card">
                    <img
                      src={PRODUCT_IMAGES[p.id]}
                      alt={p.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                  {p.category} · {p.id}
                </div>
                <h3 className="display text-2xl mt-2">{p.name}</h3>
                <Link
                  to="/producteurs/$slug"
                  params={{ slug: p.producerSlug }}
                  className="font-mono text-xs underline underline-offset-4 mt-1 hover:text-signal"
                >
                  {p.producerName}
                </Link>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="display text-4xl">{p.price.toFixed(2)}</span>
                  <span className="font-mono text-xs">€/{p.unit}</span>
                </div>

                <div className="mt-4 font-mono text-[11px] uppercase tracking-widest space-y-2">
                  <div className="flex justify-between">
                    <span>Reste</span>
                    <span>{p.available} / {p.proposed} {p.unit}</span>
                  </div>
                  <div className="h-2 border-2 border-foreground">
                    <div className="h-full bg-signal" style={{ width: `${100 - pct}%` }} />
                  </div>
                  <div className="flex justify-between opacity-70">
                    <span>Clôture</span>
                    <span>{p.closesOn}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {p.pds.map((x) => (
                    <span key={x} className="border border-current px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                      {x}
                    </span>
                  ))}
                </div>

                <Link
                  to="/commander/$id"
                  params={{ id: p.id }}
                  className="mt-6 inline-block text-center bg-foreground text-background border-2 border-foreground px-4 py-3 font-mono text-xs uppercase tracking-widest brut-shadow-signal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  Faire ma promesse →
                </Link>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-12 font-mono text-sm">Aucun produit pour ces filtres.</div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function FilterRow({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest mb-2 opacity-70">{label}</div>
      <div className="flex flex-wrap items-center gap-0">
        {options.map((o, i) => (
          <button
            key={o}
            onClick={() => setValue(o)}
            className={`border-2 ${i > 0 ? "-ml-[2px]" : ""} border-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
              value === o ? "bg-signal text-signal-foreground" : "hover:bg-signal hover:text-signal-foreground"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
