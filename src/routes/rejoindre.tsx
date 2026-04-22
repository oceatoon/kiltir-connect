import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/page-shell";

export const Route = createFileRoute("/rejoindre")({
  head: () => ({
    meta: [
      { title: "Rejoindre — Kiltir Vrak" },
      { name: "description", content: "Devenir producteur, consommateur ou transporteur dans la coopérative Kiltir Vrak." },
      { property: "og:title", content: "Rejoindre Kiltir Vrak" },
      { property: "og:description", content: "Trois rôles. Une caisse commune. Engage-toi." },
    ],
  }),
  component: RejoindrePage,
});

type Role = "producteur" | "consommateur" | "transporteur";

const ROLE_INFO: Record<Role, { title: string; sub: string; fields: { label: string; type?: string; placeholder?: string }[] }> = {
  producteur: {
    title: "Devenir producteur",
    sub: "Tu fixes ton prix. Tu choisis tes zones. La caisse t'accompagne.",
    fields: [
      { label: "Nom de ferme / structure", placeholder: "Ferme Kerouzy" },
      { label: "Email", type: "email", placeholder: "tu@ferme.bzh" },
      { label: "Zone géographique principale", placeholder: "Pays de Morlaix" },
      { label: "Familles de produits", placeholder: "Légumes, œufs, conserves..." },
    ],
  },
  consommateur: {
    title: "Devenir consommateur",
    sub: "Rejoins un point de distribution. Recharge ta caisse à partir de 50 €.",
    fields: [
      { label: "Prénom / Nom", placeholder: "Marie B." },
      { label: "Email", type: "email", placeholder: "tu@mail.bzh" },
      { label: "Point de distribution souhaité", placeholder: "PD Brest Centre" },
      { label: "Recharge initiale (€)", type: "number", placeholder: "50" },
    ],
  },
  transporteur: {
    title: "Devenir transporteur",
    sub: "Producteur, consommateur ou indépendant : chaque km est compté.",
    fields: [
      { label: "Nom", placeholder: "Yann L." },
      { label: "Email", type: "email", placeholder: "tu@mail.bzh" },
      { label: "Zone d'activité", placeholder: "Brest ↔ Morlaix" },
      { label: "Capacité véhicule (kg)", type: "number", placeholder: "300" },
    ],
  },
};

function RejoindrePage() {
  const [role, setRole] = useState<Role>("producteur");
  const info = ROLE_INFO[role];

  return (
    <PageShell>
      <PageHero
        eyebrow="Engagement"
        title="Trois portes. Une caisse."
        intro="Choisis ton rôle dans le réseau. Tu pourras en cumuler plusieurs ensuite."
      />

      <section className="px-6 md:px-12 py-12 border-b-2 border-foreground">
        <div className="grid md:grid-cols-3 border-2 border-foreground">
          {(Object.keys(ROLE_INFO) as Role[]).map((r, i) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`p-6 text-left ${i < 2 ? "md:border-r-2" : ""} ${i < 2 ? "border-b-2 md:border-b-0" : ""} border-foreground transition-colors ${
                role === r
                  ? "bg-signal text-signal-foreground"
                  : "hover:bg-card"
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                Rôle {String(i + 1).padStart(2, "0")}
              </div>
              <div className="display text-2xl mt-2 capitalize">{r}</div>
            </button>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-0 border-2 border-foreground">
          <div className="p-8 lg:border-r-2 border-b-2 lg:border-b-0 border-foreground bg-card">
            <h2 className="display text-3xl md:text-4xl">{info.title}</h2>
            <p className="mt-4 font-mono text-sm text-muted-foreground">{info.sub}</p>
            <ul className="mt-8 space-y-3 font-mono text-sm">
              <li className="flex gap-3"><span className="text-signal">→</span>Statut clair, conditions ouvertes</li>
              <li className="flex gap-3"><span className="text-signal">→</span>Aucune marge prélevée par Kiltir Vrak</li>
              <li className="flex gap-3"><span className="text-signal">→</span>Caisse commune comme tiers de confiance</li>
            </ul>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Formulaire de démonstration — backend à venir.");
            }}
            className="p-8 space-y-5"
          >
            {info.fields.map((f) => (
              <label key={f.label} className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest">{f.label}</span>
                <input
                  type={f.type ?? "text"}
                  placeholder={f.placeholder}
                  className="mt-2 w-full bg-input border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:border-signal focus:bg-background"
                />
              </label>
            ))}
            <button
              type="submit"
              className="w-full bg-signal text-signal-foreground border-2 border-foreground px-6 py-4 font-mono text-sm uppercase tracking-widest brut-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Envoyer ma déclaration →
            </button>
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              ⚠ Démonstration — l'envoi sera actif quand le backend sera branché.
            </p>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
