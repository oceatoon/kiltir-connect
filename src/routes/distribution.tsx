import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/page-shell";

export const Route = createFileRoute("/distribution")({
  head: () => ({
    meta: [
      { title: "Points de distribution — Kiltir Vrak" },
      { name: "description", content: "Lieux sécurisés où producteurs et consommateurs se retrouvent." },
      { property: "og:title", content: "Points de distribution — Kiltir Vrak" },
      { property: "og:description", content: "38 PD actifs en Bretagne. Trouvez le vôtre." },
    ],
  }),
  component: DistributionPage,
});

const PDS = [
  { city: "Brest Centre", addr: "Halle Saint-Louis", host: "Asso Kerouzy", days: "Mer · Sam" },
  { city: "Morlaix", addr: "Cour des Halles", host: "Café-cantine", days: "Jeu · Sam" },
  { city: "Carhaix", addr: "Place du Champ de Bataille", host: "Coopérative", days: "Ven" },
  { city: "Lannion", addr: "Salle Sainte-Anne", host: "Maison de quartier", days: "Mar · Sam" },
  { city: "Quimper", addr: "Halle Locronan", host: "Bistrot du peuple", days: "Mer · Dim" },
  { city: "Landerneau", addr: "Marché couvert", host: "Asso Plij", days: "Sam" },
];

function DistributionPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="38 points actifs"
        title="Lieux communs. Lieux sûrs."
        intro="Le PD est un lieu reconnu et sécurisé. Un·e responsable assure la protection des dépôts et la coordination des retraits."
      />

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-foreground">
          {PDS.map((pd, i) => (
            <article
              key={pd.city}
              className={`p-6 ${i % 3 !== 2 ? "lg:border-r-2" : ""} ${i % 2 === 0 ? "md:border-r-2 lg:border-r-0" : ""} ${i < PDS.length - 3 ? "lg:border-b-2" : ""} ${i < PDS.length - 2 ? "border-b-2" : ""} border-foreground`}
            >
              <div className="flex items-start justify-between">
                <h3 className="display text-2xl">{pd.city}</h3>
                <span className="bg-signal text-signal-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                  PD{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 font-mono text-sm">{pd.addr}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest opacity-70">
                Hôte · {pd.host}
              </p>
              <div className="mt-4 inline-block border border-current px-2 py-1 font-mono text-[10px] uppercase tracking-widest">
                {pd.days}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-card border-b-2 border-foreground px-6 md:px-12 py-16">
        <h2 className="display text-3xl md:text-5xl max-w-3xl">
          Ouvrir un point chez toi ?
        </h2>
        <p className="mt-4 max-w-xl font-mono text-sm text-muted-foreground">
          Café, mairie de village, garage associatif, hangar : toute structure capable
          d'accueillir des dépôts sécurisés peut devenir un PD.
        </p>
      </section>
    </PageShell>
  );
}
