import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { PRODUCERS } from "@/lib/mock-data";

export const Route = createFileRoute("/producteurs/$slug")({
  loader: ({ params }) => {
    const producer = PRODUCERS.find((p) => p.slug === params.slug);
    if (!producer) throw notFound();
    return producer;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Kiltir Vrak` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — Kiltir Vrak` },
          { property: "og:description", content: loaderData.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <PageShell>
      <div className="px-6 md:px-12 py-24">
        <div className="font-mono text-xs uppercase tracking-widest text-signal mb-4">▍ 404</div>
        <h1 className="display text-5xl">Producteur introuvable</h1>
        <Link to="/producteurs" className="mt-8 inline-block border-2 border-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-signal hover:text-signal-foreground">
          ← Retour à l'annuaire
        </Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="px-6 md:px-12 py-24">
        <h1 className="display text-3xl">Erreur</h1>
        <p className="font-mono text-sm mt-4">{error.message}</p>
      </div>
    </PageShell>
  ),
  component: ProducerDetailPage,
});

function ProducerDetailPage() {
  const p = Route.useLoaderData();

  return (
    <PageShell>
      <section className="border-b-2 border-foreground px-6 md:px-12 py-16 md:py-20">
        <Link to="/producteurs" className="font-mono text-[10px] uppercase tracking-widest opacity-70 hover:opacity-100">
          ← Annuaire des producteurs
        </Link>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mt-6 mb-4">▍ {p.zone}</div>
        <h1 className="display text-5xl md:text-7xl">{p.name}</h1>
        <p className="mt-6 max-w-2xl font-mono text-base text-muted-foreground">{p.description}</p>
        <div className="mt-6 flex flex-wrap gap-1">
          {p.categories.map((c) => (
            <span key={c} className="border-2 border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
              {c}
            </span>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <h2 className="display text-3xl mb-6">Produits & quantités proposées</h2>
        <div className="border-2 border-foreground overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <thead className="bg-card border-b-2 border-foreground">
              <tr>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest">Produit</th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest">Prix</th>
                <th className="text-left p-4 text-[10px] uppercase tracking-widest">Quantité disponible</th>
                <th className="text-right p-4 text-[10px] uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {p.products.map((pr, i) => (
                <tr key={pr.name} className={i < p.products.length - 1 ? "border-b-2 border-foreground/30" : ""}>
                  <td className="p-4">{pr.name}</td>
                  <td className="p-4">
                    <span className="display text-xl">{pr.price} €</span>
                    <span className="opacity-60 ml-1">{pr.unit}</span>
                  </td>
                  <td className="p-4">{pr.available}</td>
                  <td className="p-4 text-right">
                    <button className="border-2 border-foreground bg-signal text-signal-foreground px-4 py-2 text-[10px] uppercase tracking-widest hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
                      Promesse →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground grid md:grid-cols-2 gap-0">
        <div className="md:border-r-2 border-b-2 md:border-b-0 border-foreground p-8 bg-card">
          <h2 className="display text-2xl">Zone géographique</h2>
          <p className="mt-4 font-mono text-sm">{p.zone}</p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">Volume mensuel moyen : {p.volume}</p>
        </div>
        <div className="p-8">
          <h2 className="display text-2xl">Points de distribution</h2>
          <ul className="mt-4 space-y-2">
            {p.pds.map((pd) => (
              <li key={pd} className="flex gap-3 font-mono text-sm">
                <span className="text-signal">→</span>
                {pd}
              </li>
            ))}
          </ul>
          <Link
            to="/distribution"
            className="mt-6 inline-block border-2 border-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:bg-signal hover:text-signal-foreground"
          >
            Voir tous les PD →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
