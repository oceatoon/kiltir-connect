import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
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

const baseFields = {
  name: z.string().trim().min(2, "Minimum 2 caractères").max(100, "Maximum 100 caractères"),
  email: z.string().trim().email("Email invalide").max(255),
  zone: z.string().trim().min(2, "Zone requise").max(120),
  consent: z.literal(true, { message: "Tu dois accepter la charte" }),
};

const schemas: Record<Role, z.ZodTypeAny> = {
  producteur: z.object({
    ...baseFields,
    products: z.string().trim().min(2, "Décris tes familles de produits").max(300),
    volume: z.coerce.number().min(0, "Doit être ≥ 0").max(100000),
  }),
  consommateur: z.object({
    ...baseFields,
    pd: z.string().trim().min(2, "Choisis un point de distribution").max(120),
    recharge: z.coerce.number().min(50, "Recharge minimale : 50 €").max(5000),
  }),
  transporteur: z.object({
    ...baseFields,
    capacity: z.coerce.number().min(10, "Au moins 10 kg").max(20000),
    vehicle: z.string().trim().min(2, "Précise le véhicule").max(120),
  }),
};

const ROLE_INFO: Record<
  Role,
  { title: string; sub: string; fields: { name: string; label: string; type?: string; placeholder?: string }[] }
> = {
  producteur: {
    title: "Devenir producteur",
    sub: "Tu fixes ton prix. Tu choisis tes zones. La caisse t'accompagne.",
    fields: [
      { name: "name", label: "Nom de ferme / structure", placeholder: "Ferme Kerouzy" },
      { name: "email", label: "Email", type: "email", placeholder: "tu@ferme.bzh" },
      { name: "zone", label: "Zone géographique principale", placeholder: "Pays de Morlaix" },
      { name: "products", label: "Familles de produits", placeholder: "Légumes, œufs, conserves..." },
      { name: "volume", label: "Volume mensuel estimé (kg)", type: "number", placeholder: "800" },
    ],
  },
  consommateur: {
    title: "Devenir consommateur",
    sub: "Rejoins un point de distribution. Recharge ta caisse à partir de 50 €.",
    fields: [
      { name: "name", label: "Prénom / Nom", placeholder: "Marie B." },
      { name: "email", label: "Email", type: "email", placeholder: "tu@mail.bzh" },
      { name: "zone", label: "Ville / commune", placeholder: "Brest" },
      { name: "pd", label: "Point de distribution souhaité", placeholder: "PD Brest Centre" },
      { name: "recharge", label: "Recharge initiale (€, min 50)", type: "number", placeholder: "50" },
    ],
  },
  transporteur: {
    title: "Devenir transporteur",
    sub: "Producteur, consommateur ou indépendant : chaque km est compté.",
    fields: [
      { name: "name", label: "Nom", placeholder: "Yann L." },
      { name: "email", label: "Email", type: "email", placeholder: "tu@mail.bzh" },
      { name: "zone", label: "Zone d'activité", placeholder: "Brest ↔ Morlaix" },
      { name: "vehicle", label: "Type de véhicule", placeholder: "Utilitaire frigorifique" },
      { name: "capacity", label: "Capacité véhicule (kg)", type: "number", placeholder: "300" },
    ],
  },
};

function RejoindrePage() {
  const [role, setRole] = useState<Role>("producteur");
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const info = ROLE_INFO[role];

  const setRoleAndReset = (r: Role) => {
    setRole(r);
    setValues({});
    setErrors({});
    setConsent(false);
    setSubmitted(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);
    const payload: Record<string, unknown> = { ...values, consent };
    const parsed = schemas[role].safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

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
              onClick={() => setRoleAndReset(r)}
              className={`p-6 text-left ${i < 2 ? "md:border-r-2" : ""} ${i < 2 ? "border-b-2 md:border-b-0" : ""} border-foreground transition-colors ${
                role === r ? "bg-signal text-signal-foreground" : "hover:bg-card"
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

          <form onSubmit={onSubmit} className="p-8 space-y-5" noValidate>
            {info.fields.map((f) => (
              <label key={f.name} className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest">{f.label}</span>
                <input
                  type={f.type ?? "text"}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  placeholder={f.placeholder}
                  maxLength={300}
                  className="mt-2 w-full bg-input border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:border-signal focus:bg-background"
                />
                {errors[f.name] && (
                  <span className="block mt-1 font-mono text-xs text-destructive">⚠ {errors[f.name]}</span>
                )}
              </label>
            ))}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-5 w-5 accent-signal"
              />
              <span className="font-mono text-xs">
                J'accepte la charte coopérative Kiltir Vrak (transparence des prix, caisse commune, pas de marge intermédiaire).
              </span>
            </label>
            {errors.consent && (
              <span className="block font-mono text-xs text-destructive">⚠ {errors.consent}</span>
            )}

            <button
              type="submit"
              className="w-full bg-signal text-signal-foreground border-2 border-foreground px-6 py-4 font-mono text-sm uppercase tracking-widest brut-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Envoyer ma déclaration →
            </button>

            {submitted && (
              <div className="border-2 border-signal bg-signal/10 px-4 py-3 font-mono text-xs">
                ✓ Déclaration validée localement. Le backend prendra le relais.
              </div>
            )}
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              ⚠ Démonstration — l'envoi sera actif quand le backend sera branché.
            </p>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
