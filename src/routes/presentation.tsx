import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { PRODUCERS, PD_IMAGES, CATALOG } from "@/lib/mock-data";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Présentation du projet — Kiltir Vrak" },
      {
        name: "description",
        content:
          "Le projet Kiltir Vrak en 11 écrans : pour qui, pourquoi, comment ça marche, fonctionnalités, déploiement, animation et coûts.",
      },
      { property: "og:title", content: "Kiltir Vrak — Présentation du projet" },
      {
        property: "og:description",
        content:
          "Circuit court coopératif : caisse commune, transport mutualisé, producteurs payés justement. Présentation swipeable.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Presentation,
});

/* ---------------------------------- chrome --------------------------------- */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-signal mb-4 md:mb-6">
      ▍ {children}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="display text-4xl sm:text-5xl md:text-7xl leading-[0.88]">{children}</h2>;
}

function Slide({
  children,
  tone = "ink",
}: {
  children: React.ReactNode;
  tone?: "ink" | "card" | "signal";
}) {
  const bg =
    tone === "signal" ? "bg-signal text-signal-foreground" : tone === "card" ? "bg-card" : "bg-background";
  return (
    <section className={`h-full w-full overflow-y-auto ${bg}`}>
      <div className="min-h-full px-6 md:px-16 py-12 md:py-16 flex flex-col justify-center max-w-[1400px] mx-auto">
        {children}
      </div>
    </section>
  );
}

function Cards({
  items,
  cols = 3,
}: {
  items: { tag?: string; title: string; body: string }[];
  cols?: 2 | 3 | 4;
}) {
  const grid = cols === 2 ? "md:grid-cols-2" : cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";
  return (
    <div className={`grid ${grid} border-2 border-foreground mt-8 md:mt-12`}>
      {items.map((it, i) => (
        <div
          key={it.title}
          className={`p-6 md:p-8 border-foreground border-b-2 last:border-b-0 md:border-b-0 ${
            i < items.length - 1 ? "md:border-r-2" : ""
          }`}
        >
          {it.tag && (
            <div className="inline-block bg-signal text-signal-foreground px-2 py-1 font-mono text-[10px] uppercase tracking-widest mb-4">
              {it.tag}
            </div>
          )}
          <h3 className="display text-xl md:text-2xl">{it.title}</h3>
          <p className="mt-3 font-mono text-xs md:text-sm leading-relaxed text-muted-foreground">{it.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- slides -------------------------------- */

function SlideCover() {
  return (
    <Slide>
      <Kicker>Présentation — Édition 01</Kicker>
      <h1 className="display text-[13vw] md:text-[8.5vw] leading-[0.82]">
        KILTIR<span className="text-signal">/</span>VRAK
      </h1>
      <p className="mt-8 max-w-3xl font-mono text-sm md:text-lg leading-relaxed">
        La coopérative numérique du circuit court. Les producteurs proposent, les habitants commandent,
        le transport est mutualisé, la caisse commune garantit le paiement.
      </p>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 border-2 border-foreground">
        {[
          ["1", "Caisse commune"],
          ["3", "Rôles coopérants"],
          ["0", "Intermédiaire spéculatif"],
          ["100%", "Local & traçable"],
        ].map(([k, l], i) => (
          <div key={l} className={`p-5 border-foreground ${i < 3 ? "border-r-2" : ""} [&:nth-child(2n)]:bg-card`}>
            <div className="display text-3xl md:text-5xl text-signal">{k}</div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest">{l}</div>
          </div>
        ))}
      </div>
      <div className="mt-10 font-mono text-[11px] uppercase tracking-widest opacity-70">
        Glissez / flèches → pour avancer
      </div>
    </Slide>
  );
}

function SlideForWhom() {
  return (
    <Slide tone="card">
      <Kicker>Pour qui</Kicker>
      <Title>
        Quatre publics,<br />
        <span className="text-signal">une même caisse.</span>
      </Title>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-2 border-foreground mt-8 md:mt-12 bg-background">
        {[
          {
            tag: "Producteur",
            title: "Vendre sans subir",
            body: "Fixe ton prix, ta quantité, tes points de distribution. Paiement garanti dès la promesse.",
          },
          {
            tag: "Consommateur",
            title: "Manger local, payer juste",
            body: "Un compte crédité d'avance, une commande directe, un retrait au point de distribution du quartier.",
          },
          {
            tag: "Transporteur",
            title: "Mutualiser les tournées",
            body: "Kilos et kilomètres comptabilisés, rémunérés par la caisse. Voisin, producteur ou pro.",
          },
          {
            tag: "Collectivité",
            title: "Piloter son territoire",
            body: "Observatoire des volumes, des zones et des prix pour appuyer une politique alimentaire locale.",
          },
        ].map((r, i) => (
          <div key={r.tag} className={`p-6 md:p-8 border-foreground ${i < 3 ? "lg:border-r-2" : ""} border-b-2 lg:border-b-0`}>
            <div className="inline-block bg-signal text-signal-foreground px-2 py-1 font-mono text-[10px] uppercase tracking-widest">
              {r.tag}
            </div>
            <h3 className="display text-2xl mt-5">{r.title}</h3>
            <p className="mt-3 font-mono text-xs md:text-sm leading-relaxed text-muted-foreground">{r.body}</p>
          </div>
        ))}
      </div>
    </Slide>
  );
}

function SlideWhy() {
  return (
    <Slide>
      <Kicker>Pour quoi</Kicker>
      <Title>
        La marge doit rester<br />
        <span className="text-signal">dans le territoire.</span>
      </Title>
      <div className="mt-8 md:mt-12 grid md:grid-cols-2 border-2 border-foreground">
        <div className="p-6 md:p-10 border-b-2 md:border-b-0 md:border-r-2 border-foreground">
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">Le problème</div>
          <ul className="mt-6 space-y-4 font-mono text-sm">
            {[
              "Le producteur encaisse une fraction du prix payé en rayon.",
              "Les invendus et le gaspillage pèsent sur celui qui produit.",
              "Les frais logistiques sont subis, jamais partagés.",
              "Aucune visibilité sur ce que le territoire produit vraiment.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="text-destructive">✕</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 md:p-10 bg-card">
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">Notre réponse</div>
          <ul className="mt-6 space-y-4 font-mono text-sm">
            {[
              "Prix fixé par le producteur, affiché tel quel au consommateur.",
              "Production vendue avant récolte : la promesse engage les deux parties.",
              "Transport mutualisé et rémunéré à la charge collective.",
              "Observatoire ouvert : volumes, zones, saisonnalité.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="text-signal">→</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Slide>
  );
}

function SlideHow() {
  const steps = [
    { n: "01", t: "Le producteur propose", d: "Quantité, prix, clôture, points de distribution desservis." },
    { n: "02", t: "Le consommateur commande", d: "Il paie depuis son crédit. La somme est gelée dans la caisse commune." },
    { n: "03", t: "Le transport s'organise", d: "Producteur, consommateur ou transporteur dédié prend la course." },
    { n: "04", t: "Réception & libération", d: "Le retrait confirmé au PD déclenche le paiement au producteur." },
  ];
  return (
    <Slide tone="card">
      <Kicker>Comment ça fonctionne</Kicker>
      <Title>Quatre temps, zéro zone grise.</Title>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-2 border-foreground mt-8 md:mt-12 bg-background">
        {steps.map((s, i) => (
          <div key={s.n} className={`p-6 md:p-8 border-foreground border-b-2 lg:border-b-0 ${i < 3 ? "lg:border-r-2" : ""}`}>
            <div className="display text-5xl md:text-6xl text-signal">{s.n}</div>
            <h3 className="display text-xl md:text-2xl mt-4">{s.t}</h3>
            <p className="mt-3 font-mono text-xs md:text-sm leading-relaxed text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 border-2 border-foreground p-5 font-mono text-xs md:text-sm bg-signal text-signal-foreground">
        Promesse → Paiement gelé → Livraison → Réception → Paiement libéré
      </div>
    </Slide>
  );
}

function SlideWallet() {
  return (
    <Slide>
      <Kicker>La caisse commune</Kicker>
      <Title>
        L'argent est là<br />
        <span className="text-signal">avant la récolte.</span>
      </Title>
      <div className="mt-8 md:mt-12 grid md:grid-cols-3 border-2 border-foreground">
        {[
          ["50 €", "Recharge minimum à l'entrée dans la caisse"],
          ["Gel", "La somme est bloquée dès la promesse, pas encaissée"],
          ["Libération", "Le producteur est payé à la confirmation de réception"],
        ].map(([k, l], i) => (
          <div key={l} className={`p-6 md:p-10 border-foreground border-b-2 md:border-b-0 ${i < 2 ? "md:border-r-2" : ""} [&:nth-child(2n)]:bg-card`}>
            <div className="display text-4xl md:text-6xl text-signal">{k}</div>
            <p className="mt-4 font-mono text-xs md:text-sm text-muted-foreground leading-relaxed">{l}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-3xl font-mono text-xs md:text-sm text-muted-foreground leading-relaxed">
        Chaque mouvement (recharge, promesse, paiement, rémunération de course, virement) est tracé dans le
        portefeuille du membre. Quand le solde tombe à zéro, une notification demande une recharge.
      </p>
    </Slide>
  );
}

function SlideFeatures() {
  const features = [
    ["Annuaires", "Producteurs, transporteurs, points de distribution avec zones géographiques."],
    ["Catalogue", "Produits disponibles, prix, quantités restantes, date de clôture."],
    ["Commande rapide", "Promesse en un clic depuis la home ou le catalogue, sans changer de page."],
    ["Suivi de commandes", "Statuts promesse / paiement / livraison / réception, côté acheteur et vendeur."],
    ["Portefeuille", "Solde, historique, recharge, demande de virement."],
    ["Courses", "Déclaration de course, kilos et distance, rémunération auto-calculée."],
    ["Points de distribution", "Rattachement des membres, retraits, créneaux, contenu attendu du jour."],
    ["Observatoire", "Volumes, marge au producteur, dynamique par zone et par catégorie."],
  ];
  return (
    <Slide tone="card">
      <Kicker>Les fonctionnalités</Kicker>
      <Title>Ce qui tourne déjà.</Title>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-2 border-foreground mt-8 md:mt-12 bg-background">
        {features.map(([t, d], i) => (
          <div
            key={t}
            className={`p-5 md:p-6 border-foreground border-b-2 ${i % 4 !== 3 ? "lg:border-r-2" : ""} ${i % 2 === 0 ? "sm:border-r-2 lg:border-r-2" : ""} ${
              i >= features.length - 4 ? "lg:border-b-0" : ""
            }`}
          >
            <h3 className="display text-lg md:text-xl">{t}</h3>
            <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </Slide>
  );
}

function SlideTerritory() {
  const pds = Object.keys(PD_IMAGES).slice(0, 4);
  return (
    <Slide>
      <Kicker>Le maillage</Kicker>
      <Title>
        Des fermes,<br />
        <span className="text-signal">des points de retrait.</span>
      </Title>
      <div className="mt-8 md:mt-12 grid grid-cols-2 lg:grid-cols-4 border-2 border-foreground">
        {pds.map((id, i) => (
          <div key={id} className={`border-foreground ${i < 3 ? "lg:border-r-2" : ""} ${i % 2 === 0 ? "border-r-2" : ""} border-b-2 lg:border-b-0`}>
            <img src={PD_IMAGES[id]} alt={`Point de distribution ${id}`} loading="lazy" className="w-full aspect-[4/3] object-cover border-b-2 border-foreground" />
            <div className="p-4 font-mono text-[10px] uppercase tracking-widest">{id}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-3 border-2 border-foreground">
        {[
          [String(PRODUCERS.length), "Producteurs référencés"],
          [String(CATALOG.length), "Références au catalogue"],
          [String(Object.keys(PD_IMAGES).length), "Points de distribution"],
        ].map(([k, l], i) => (
          <div key={l} className={`p-5 border-foreground ${i < 2 ? "border-r-2" : ""} [&:nth-child(2n)]:bg-card`}>
            <div className="display text-3xl md:text-5xl text-signal">{k}</div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest">{l}</div>
          </div>
        ))}
      </div>
    </Slide>
  );
}

function SlideDeployment() {
  const phases = [
    { tag: "Phase 1", title: "Pilote", body: "Un bassin, une dizaine de producteurs, 3 points de distribution. Données mockées remplacées par le backend." },
    { tag: "Phase 2", title: "Ouverture", body: "Inscriptions libres, caisse commune réelle, courses déclarées et rémunérées." },
    { tag: "Phase 3", title: "Réplication", body: "Un nouveau bassin = une nouvelle zone dans la même app, gouvernance locale autonome." },
  ];
  return (
    <Slide tone="card">
      <Kicker>Le déploiement</Kicker>
      <Title>
        Un bassin d'abord.<br />
        <span className="text-signal">Puis on duplique.</span>
      </Title>
      <Cards items={phases} />
      <p className="mt-8 max-w-3xl font-mono text-xs md:text-sm text-muted-foreground leading-relaxed">
        Application web installable (mobile et desktop), hébergement managé, mises à jour continues.
        Aucune installation à faire dans les fermes ou les points de distribution.
      </p>
    </Slide>
  );
}

function SlideAnimation() {
  return (
    <Slide>
      <Kicker>L'animation</Kicker>
      <Title>
        Le logiciel ne remplace<br />
        <span className="text-signal">pas les humains.</span>
      </Title>
      <div className="mt-8 md:mt-12 grid md:grid-cols-3 border-2 border-foreground">
        {[
          { title: "Référent de bassin", body: "Accueille les nouveaux producteurs, vérifie les fiches, anime les tournées." },
          { title: "Hôte de point de distribution", body: "Ouvre le créneau de retrait, valide les réceptions, signale les litiges." },
          { title: "Collectif de gouvernance", body: "Fixe les règles de la caisse, le barème de transport, arbitre les conflits." },
        ].map((r, i) => (
          <div key={r.title} className={`p-6 md:p-10 border-foreground border-b-2 md:border-b-0 ${i < 2 ? "md:border-r-2" : ""} [&:nth-child(2n)]:bg-card`}>
            <h3 className="display text-2xl">{r.title}</h3>
            <p className="mt-4 font-mono text-xs md:text-sm text-muted-foreground leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>
    </Slide>
  );
}

function SlideCost() {
  const lines = [
    ["Contribution membre", "[MONTANT — à décider]", "Adhésion annuelle au collectif"],
    ["Frais de caisse", "[% — à décider]", "Sur chaque commande, couvre la plateforme"],
    ["Barème transport", "[€/kg + €/km — à décider]", "Reversé au porteur de la course"],
    ["Hébergement & app", "[COÛT MENSUEL — à chiffrer]", "Mutualisé entre les bassins"],
  ];
  return (
    <Slide tone="card">
      <Kicker>Le coût</Kicker>
      <Title>
        Transparent,<br />
        <span className="text-signal">décidé ensemble.</span>
      </Title>
      <div className="mt-8 md:mt-12 border-2 border-foreground bg-background">
        {lines.map(([t, v, d], i) => (
          <div key={t} className={`flex flex-wrap items-baseline justify-between gap-3 p-5 md:p-6 ${i < lines.length - 1 ? "border-b-2 border-foreground" : ""}`}>
            <div>
              <div className="display text-xl md:text-2xl">{t}</div>
              <div className="font-mono text-xs text-muted-foreground mt-1">{d}</div>
            </div>
            <div className="font-mono text-xs md:text-sm uppercase tracking-widest text-signal">{v}</div>
          </div>
        ))}
      </div>
      <p className="mt-6 font-mono text-[11px] md:text-xs uppercase tracking-widest text-destructive">
        ⚠ Les montants entre crochets sont des emplacements à remplir avec vos chiffres réels.
      </p>
    </Slide>
  );
}

function SlideCta() {
  return (
    <Slide tone="signal">
      <div className="font-mono text-xs uppercase tracking-[0.35em] mb-6">▍ À vous</div>
      <h2 className="display text-5xl sm:text-6xl md:text-8xl leading-[0.85]">
        On démonte<br />la chaîne<br />ensemble ?
      </h2>
      <div className="mt-10 flex flex-wrap gap-0">
        <Link
          to="/rejoindre"
          className="bg-signal-foreground text-signal border-2 border-signal-foreground px-8 py-5 font-mono text-sm uppercase tracking-widest"
        >
          Rejoindre le mouvement →
        </Link>
        <Link
          to="/observatoire"
          className="border-2 border-signal-foreground -ml-[2px] px-8 py-5 font-mono text-sm uppercase tracking-widest"
        >
          Voir les chiffres
        </Link>
      </div>
    </Slide>
  );
}

const SLIDES: { id: string; label: string; render: () => React.ReactNode }[] = [
  { id: "couverture", label: "Kiltir Vrak", render: () => <SlideCover /> },
  { id: "pour-qui", label: "Pour qui", render: () => <SlideForWhom /> },
  { id: "pour-quoi", label: "Pour quoi", render: () => <SlideWhy /> },
  { id: "mecanique", label: "Comment ça marche", render: () => <SlideHow /> },
  { id: "caisse", label: "La caisse commune", render: () => <SlideWallet /> },
  { id: "fonctionnalites", label: "Fonctionnalités", render: () => <SlideFeatures /> },
  { id: "maillage", label: "Le maillage", render: () => <SlideTerritory /> },
  { id: "deploiement", label: "Déploiement", render: () => <SlideDeployment /> },
  { id: "animation", label: "Animation", render: () => <SlideAnimation /> },
  { id: "cout", label: "Le coût", render: () => <SlideCost /> },
  { id: "rejoindre", label: "Rejoindre", render: () => <SlideCta /> },
];

/* ---------------------------------- shell --------------------------------- */

function Presentation() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (n: number) => setIndex((i) => Math.min(total - 1, Math.max(0, n))),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setIndex((i) => Math.min(total - 1, i + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "Home") setIndex(0);
      else if (e.key === "End") setIndex(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  useEffect(() => {
    document.title = `${index + 1}/${total} — ${SLIDES[index].label} — Kiltir Vrak`;
  }, [index, total]);

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-background">
      {/* top bar */}
      <div className="flex items-stretch justify-between border-b-2 border-foreground shrink-0">
        <Link
          to="/"
          className="px-5 py-3 border-r-2 border-foreground font-mono text-[11px] uppercase tracking-widest hover:bg-signal hover:text-signal-foreground"
        >
          ← Retour à l'app
        </Link>
        <div className="hidden md:flex items-center px-5 font-mono text-[11px] uppercase tracking-widest opacity-70 truncate">
          {SLIDES[index].label}
        </div>
        <div className="px-5 py-3 border-l-2 border-foreground font-mono text-[11px] uppercase tracking-widest">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>

      {/* deck */}
      <div
        className="relative flex-1 overflow-hidden"
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((s) => (
            <div key={s.id} className="h-full w-full shrink-0">
              {s.render()}
            </div>
          ))}
        </div>

        {/* arrows */}
        {index > 0 && (
          <button
            onClick={() => go(index - 1)}
            aria-label="Diapositive précédente"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 border-2 border-foreground bg-background font-mono hover:bg-signal hover:text-signal-foreground"
          >
            ←
          </button>
        )}
        {index < total - 1 && (
          <button
            onClick={() => go(index + 1)}
            aria-label="Diapositive suivante"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 border-2 border-foreground bg-background font-mono hover:bg-signal hover:text-signal-foreground"
          >
            →
          </button>
        )}
      </div>

      {/* bottom nav */}
      <div className="shrink-0 border-t-2 border-foreground">
        <div className="h-1.5 bg-muted">
          <div
            className="h-full bg-signal transition-all duration-500"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              aria-label={s.label}
              aria-current={i === index}
              className={`shrink-0 border-2 border-foreground px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap ${
                i === index ? "bg-signal text-signal-foreground" : "hover:bg-muted"
              }`}
            >
              {String(i + 1).padStart(2, "0")} {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
