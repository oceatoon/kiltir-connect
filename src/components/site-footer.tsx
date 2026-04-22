import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-foreground bg-background">
      <div className="overflow-hidden border-b-2 border-foreground bg-signal text-signal-foreground py-4">
        <div className="marquee flex gap-12 whitespace-nowrap font-display text-3xl uppercase">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12">
              <span>★ Circuit court</span>
              <span>★ Producteurs payés justement</span>
              <span>★ Transport mutualisé</span>
              <span>★ Zéro intermédiaire spéculatif</span>
              <span>★ Caisse commune</span>
              <span>★ Souveraineté alimentaire</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
        <div className="p-8 md:border-r-2 border-b-2 md:border-b-0 border-foreground">
          <div className="display text-3xl">KILTIR/VRAK</div>
          <p className="mt-3 font-mono text-xs uppercase opacity-70">
            Coopérative numérique du circuit court.
          </p>
        </div>
        <FooterCol title="Annuaires">
          <Link to="/producteurs" className="hover:text-signal">Producteurs</Link>
          <Link to="/transporteurs" className="hover:text-signal">Transporteurs</Link>
          <Link to="/distribution" className="hover:text-signal">Points de distribution</Link>
        </FooterCol>
        <FooterCol title="Observatoire">
          <Link to="/observatoire" className="hover:text-signal">Données ouvertes</Link>
          <a className="hover:text-signal" href="#">Manifeste</a>
          <a className="hover:text-signal" href="#">Statuts</a>
        </FooterCol>
        <FooterCol title="Rejoindre">
          <Link to="/rejoindre" className="hover:text-signal">Devenir producteur</Link>
          <Link to="/rejoindre" className="hover:text-signal">Devenir consommateur</Link>
          <Link to="/rejoindre" className="hover:text-signal">Devenir transporteur</Link>
        </FooterCol>
      </div>

      <div className="border-t-2 border-foreground px-8 py-4 flex flex-col md:flex-row justify-between gap-2 font-mono text-[10px] uppercase tracking-widest opacity-70">
        <span>© {new Date().getFullYear()} Kiltir Vrak — usage commun</span>
        <span>Made by the people, for the people</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-8 md:border-r-2 border-b-2 md:border-b-0 border-foreground last:border-r-0">
      <h4 className="display text-sm mb-4">{title}</h4>
      <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
        {children}
      </div>
    </div>
  );
}
