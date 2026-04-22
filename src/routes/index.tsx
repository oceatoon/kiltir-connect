import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kiltir Vrak — Coopérative numérique du circuit court" },
      {
        name: "description",
        content:
          "Producteurs, consommateurs et transporteurs réunis dans une caisse commune pour un circuit court sans intermédiaire spéculatif.",
      },
      { property: "og:title", content: "Kiltir Vrak — Circuit court coopératif" },
      {
        property: "og:description",
        content: "Caisse commune, transport mutualisé, producteurs payés justement.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      <Hero />
      <Manifesto />
      <HowItWorks />
      <RolesGrid />
      <LiveStrip />
      <Cta />
    </PageShell>
  );
}

function Hero() {
  return (
    <section className="relative border-b-2 border-foreground overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--paper) 0 1px, transparent 1px 18px)",
        }}
      />
      <div className="relative px-6 md:px-12 py-16 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-signal mb-8">
          ▍ Manifeste — Édition 01
        </div>
        <h1 className="display text-[15vw] md:text-[10vw] leading-[0.85]">
          ON MANGE<br />
          <span className="text-signal">CE QUE L'ON</span><br />
          PRODUIT.
        </h1>
        <p className="mt-10 max-w-2xl text-lg md:text-xl font-mono">
          Kiltir Vrak relie producteurs et consommateurs sans marge cachée.
          Une caisse commune. Un transport partagé. Zéro spéculation.
        </p>
        <div className="mt-12 flex flex-wrap gap-0">
          <Link
            to="/rejoindre"
            className="bg-signal text-signal-foreground border-2 border-foreground px-8 py-5 font-mono text-sm uppercase tracking-widest brut-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Rejoindre →
          </Link>
          <Link
            to="/observatoire"
            className="border-2 border-foreground px-8 py-5 font-mono text-sm uppercase tracking-widest hover:bg-signal hover:text-signal-foreground transition-colors -ml-[2px]"
          >
            Voir les chiffres
          </Link>
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { k: "127", l: "Producteurs", s: "actifs" },
  { k: "1.4t", l: "Volumes", s: "ce mois" },
  { k: "38", l: "Points de", s: "distribution" },
  { k: "92%", l: "Marge au", s: "producteur" },
];

function Manifesto() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 border-b-2 border-foreground">
      {STATS.map((s, i) => (
        <div
          key={i}
          className="border-r-2 last:border-r-0 border-foreground p-6 md:p-10 [&:nth-child(2n)]:bg-card"
        >
          <div className="display text-5xl md:text-7xl text-signal">{s.k}</div>
          <div className="mt-3 font-mono text-xs uppercase tracking-widest">
            {s.l}<br />{s.s}
          </div>
        </div>
      ))}
    </section>
  );
}

const STEPS = [
  {
    n: "01",
    t: "Le producteur propose",
    d: "Une quantité, un prix, des zones de livraison. Visible immédiatement par les consommateurs rattachés.",
  },
  {
    n: "02",
    t: "Le consommateur commande",
    d: "Il paie depuis son compte rechargé. L'argent est gelé dans la caisse commune. Le producteur reçoit une promesse.",
  },
  {
    n: "03",
    t: "Le transport mutualisé",
    d: "Producteur, consommateur ou transporteur dédié. Quantité et distance sont comptabilisées et rémunérées.",
  },
  {
    n: "04",
    t: "Réception, paiement",
    d: "Le consommateur confirme la réception au point de distribution. La caisse libère l'argent au producteur.",
  },
];

function HowItWorks() {
  return (
    <section className="px-6 md:px-12 py-20 border-b-2 border-foreground">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-6">
        ▍ Mécanique
      </div>
      <h2 className="display text-4xl md:text-6xl mb-16 max-w-3xl">
        Quatre temps. Aucun intermédiaire qui s'enrichit.
      </h2>
      <div className="grid md:grid-cols-2 gap-0 border-2 border-foreground">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className={`p-8 md:p-10 ${i % 2 === 0 ? "md:border-r-2" : ""} ${
              i < 2 ? "border-b-2" : ""
            } border-foreground`}
          >
            <div className="display text-6xl text-signal">{s.n}</div>
            <h3 className="display text-2xl mt-4">{s.t}</h3>
            <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
              {s.d}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const ROLES = [
  {
    tag: "Producteur",
    title: "Vendre sans subir",
    points: [
      "Fixer ton prix, ta quantité minimum",
      "Choisir tes zones et points de distribution",
      "Tableau de bord, factures, virements",
    ],
  },
  {
    tag: "Consommateur",
    title: "Manger sans engraisser la chaîne",
    points: [
      "Caisse créditée d'avance, minimum 50 €",
      "Commande directe au producteur",
      "Réception au point de distribution proche",
    ],
  },
  {
    tag: "Transporteur",
    title: "Bouger les choses, pas les marges",
    points: [
      "Quantité (kg) et distance comptabilisées",
      "Rémunération sur la caisse commune",
      "Demandes de course directe possibles",
    ],
  },
];

function RolesGrid() {
  return (
    <section className="bg-card border-b-2 border-foreground">
      <div className="px-6 md:px-12 py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-signal mb-6">
          ▍ Trois rôles, une caisse
        </div>
        <h2 className="display text-4xl md:text-6xl mb-16">
          Choisis ton camp.<br />
          <span className="text-signal">Tous gagnent.</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-0 border-2 border-foreground">
          {ROLES.map((r, i) => (
            <div
              key={r.tag}
              className={`p-8 bg-background ${i < 2 ? "md:border-r-2" : ""} border-foreground`}
            >
              <div className="inline-block bg-signal text-signal-foreground px-3 py-1 font-mono text-[10px] uppercase tracking-widest">
                {r.tag}
              </div>
              <h3 className="display text-3xl mt-6">{r.title}</h3>
              <ul className="mt-6 space-y-3 font-mono text-sm">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="text-signal">→</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveStrip() {
  return (
    <section className="border-b-2 border-foreground bg-signal text-signal-foreground overflow-hidden">
      <div className="marquee flex gap-12 whitespace-nowrap py-6 font-mono text-sm uppercase tracking-widest">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-12">
            <span>● 12 kg de pommes — Domaine de Plourin → PD Brest Centre</span>
            <span>● 30 L de cidre — Ferme Kerouzy → PD Morlaix</span>
            <span>● 8 kg de farine T80 — Moulin de Kervern → PD Carhaix</span>
            <span>● 24 œufs — GAEC Ar Yaouank → PD Lannion</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="px-6 md:px-12 py-24 text-center">
      <h2 className="display text-5xl md:text-7xl">
        On démonte la chaîne<br />
        <span className="text-signal">ensemble ?</span>
      </h2>
      <div className="mt-12 inline-flex flex-wrap justify-center gap-0">
        <Link
          to="/rejoindre"
          className="bg-signal text-signal-foreground border-2 border-foreground px-10 py-5 font-mono text-sm uppercase tracking-widest brut-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          Je rejoins
        </Link>
        <Link
          to="/producteurs"
          className="border-2 border-foreground px-10 py-5 font-mono text-sm uppercase tracking-widest hover:bg-signal hover:text-signal-foreground transition-colors -ml-[2px]"
        >
          Je découvre les producteurs
        </Link>
      </div>
    </section>
  );
}
