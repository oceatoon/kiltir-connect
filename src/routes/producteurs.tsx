import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/page-shell";

export const Route = createFileRoute("/producteurs")({
  head: () => ({
    meta: [
      { title: "Producteurs — Kiltir Vrak" },
      { name: "description", content: "Annuaire des producteurs locaux engagés dans le circuit court Kiltir Vrak." },
      { property: "og:title", content: "Producteurs — Kiltir Vrak" },
      { property: "og:description", content: "Découvrez les producteurs et leurs zones de distribution." },
    ],
  }),
  component: ProducteursPage,
});

const PRODUCERS = [
  { name: "Domaine de Plourin", zone: "Finistère Nord", products: ["Pommes", "Cidre", "Jus"], volume: "1.2t / mois" },
  { name: "Ferme Kerouzy", zone: "Pays de Morlaix", products: ["Légumes bio", "Œufs"], volume: "800 kg / mois" },
  { name: "Moulin de Kervern", zone: "Centre Bretagne", products: ["Farines", "Pains"], volume: "450 kg / mois" },
  { name: "GAEC Ar Yaouank", zone: "Trégor", products: ["Œufs", "Poulets"], volume: "600 kg / mois" },
  { name: "Conserverie Penn ar Bed", zone: "Iroise", products: ["Soupes", "Conserves"], volume: "320 kg / mois" },
  { name: "Bergerie de Menez", zone: "Monts d'Arrée", products: ["Fromage", "Agneau"], volume: "210 kg / mois" },
];

function ProducteursPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Annuaire — 127 producteurs"
        title="Celles et ceux qui nourrissent."
        intro="Cartographie ouverte des producteurs Kiltir Vrak. Chacun fixe son prix, ses zones et ses volumes."
      />

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <div className="flex flex-wrap items-center gap-0 mb-10">
          {["Tous", "Maraîchage", "Élevage", "Boulange", "Boissons", "Transformés"].map(
            (f, i) => (
              <button
                key={f}
                className={`border-2 ${i > 0 ? "-ml-[2px]" : ""} border-foreground px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
                  i === 0 ? "bg-signal text-signal-foreground" : "hover:bg-signal hover:text-signal-foreground"
                }`}
              >
                {f}
              </button>
            ),
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-foreground">
          {PRODUCERS.map((p, i) => (
            <article
              key={p.name}
              className={`p-6 ${i % 3 !== 2 ? "lg:border-r-2" : ""} ${i % 2 === 0 ? "md:border-r-2 lg:border-r-0" : ""} ${i < PRODUCERS.length - 3 ? "lg:border-b-2" : ""} ${i < PRODUCERS.length - 2 ? "border-b-2" : ""} border-foreground hover:bg-signal hover:text-signal-foreground transition-colors group`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-70 group-hover:opacity-100">
                {p.zone}
              </div>
              <h3 className="display text-2xl mt-2">{p.name}</h3>
              <div className="mt-4 flex flex-wrap gap-1">
                {p.products.map((pr) => (
                  <span
                    key={pr}
                    className="border border-current px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
                  >
                    {pr}
                  </span>
                ))}
              </div>
              <div className="mt-6 font-mono text-xs">{p.volume}</div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/rejoindre"
            className="inline-block bg-foreground text-background border-2 border-foreground px-8 py-4 font-mono text-xs uppercase tracking-widest brut-shadow-signal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Devenir producteur →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
