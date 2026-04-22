import { Link } from "@tanstack/react-router";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/producteurs", label: "Producteurs" },
  { to: "/transporteurs", label: "Transporteurs" },
  { to: "/distribution", label: "Points de distribution" },
  { to: "/observatoire", label: "Observatoire" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-foreground bg-background">
      <div className="flex items-stretch justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 border-r-2 border-foreground px-5 py-4 hover:bg-signal hover:text-signal-foreground transition-colors"
        >
          <span className="display text-2xl tracking-tighter">KILTIR<span className="text-signal group-hover:text-ink">/</span>VRAK</span>
        </Link>

        <nav className="hidden lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="border-l-2 border-foreground px-4 py-4 text-xs font-mono uppercase tracking-widest hover:bg-signal hover:text-signal-foreground transition-colors"
              activeProps={{ className: "bg-signal text-signal-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/rejoindre"
            className="border-l-2 border-foreground bg-foreground px-6 py-4 text-xs font-mono uppercase tracking-widest text-background hover:bg-signal hover:text-signal-foreground transition-colors"
          >
            Rejoindre →
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden border-l-2 border-foreground px-5 font-mono text-xs uppercase"
          aria-label="Menu"
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t-2 border-foreground flex flex-col">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="border-b-2 border-foreground px-5 py-4 font-mono text-sm uppercase tracking-widest hover:bg-signal hover:text-signal-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/rejoindre"
            onClick={() => setOpen(false)}
            className="bg-signal text-signal-foreground px-5 py-4 font-mono text-sm uppercase tracking-widest"
          >
            Rejoindre le mouvement →
          </Link>
        </nav>
      )}
    </header>
  );
}
