import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/page-shell";

export const Route = createFileRoute("/transporteurs")({
  head: () => ({
    meta: [
      { title: "Transporteurs — Kiltir Vrak" },
      { name: "description", content: "Réseau de transporteurs participatifs : producteurs, consommateurs et indépendants mutualisent les courses." },
      { property: "og:title", content: "Transporteurs — Kiltir Vrak" },
      { property: "og:description", content: "Mutualisation des trajets, kilos et kilomètres comptabilisés." },
    ],
  }),
  component: TransporteursPage,
});

const TRANSPORTERS = [
  { name: "Yann L.", zone: "Brest ↔ Morlaix", km: 1240, kg: 820, role: "Indépendant" },
  { name: "Ferme Kerouzy", zone: "Trégor → Brest", km: 480, kg: 1200, role: "Producteur" },
  { name: "Marie B.", zone: "Carhaix ↔ Quimper", km: 920, kg: 340, role: "Consommatrice" },
  { name: "Coop Penn ar Bed", zone: "Tour Finistère", km: 2100, kg: 3800, role: "Coopérative" },
];

function TransporteursPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Réseau — 42 transporteurs"
        title="Le camion n'est plus une marge, c'est un service."
        intro="Producteurs, consommateurs ou indépendants : chaque kilomètre est tracé, chaque kilo rémunéré sur la caisse commune."
      />

      <section className="grid md:grid-cols-3 border-b-2 border-foreground">
        {[
          { k: "18 420", l: "km parcourus" },
          { k: "12.4t", l: "kg transportés" },
          { k: "7 320 €", l: "redistribués" },
        ].map((s, i) => (
          <div
            key={s.l}
            className={`p-8 md:p-10 ${i < 2 ? "md:border-r-2" : ""} border-foreground`}
          >
            <div className="display text-5xl md:text-6xl text-signal">{s.k}</div>
            <div className="mt-3 font-mono text-xs uppercase tracking-widest">{s.l} / mois</div>
          </div>
        ))}
      </section>

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <h2 className="display text-3xl md:text-4xl mb-8">Courses récentes</h2>
        <div className="border-2 border-foreground overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="bg-foreground text-background">
                {["Transporteur", "Trajet", "Distance", "Charge", "Rôle"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 uppercase text-xs tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSPORTERS.map((t) => (
                <tr key={t.name} className="border-t-2 border-foreground hover:bg-signal hover:text-signal-foreground">
                  <td className="px-4 py-4 font-bold">{t.name}</td>
                  <td className="px-4 py-4">{t.zone}</td>
                  <td className="px-4 py-4">{t.km} km</td>
                  <td className="px-4 py-4">{t.kg} kg</td>
                  <td className="px-4 py-4 uppercase text-xs">{t.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <Link
            to="/rejoindre"
            className="inline-block bg-signal text-signal-foreground border-2 border-foreground px-8 py-4 font-mono text-xs uppercase tracking-widest brut-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Devenir transporteur →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
