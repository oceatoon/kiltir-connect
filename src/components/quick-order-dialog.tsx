import { useState } from "react";
import type { CatalogProduct } from "@/lib/mock-data";
import { PRODUCT_IMAGES } from "@/lib/mock-data";

type Props = {
  product: CatalogProduct | null;
  onClose: () => void;
};

export function QuickOrderDialog({ product, onClose }: Props) {
  const [qty, setQty] = useState(1);
  const [pd, setPd] = useState<string>("");
  const [done, setDone] = useState(false);

  if (!product) return null;
  const selectedPd = pd || product.pds[0];
  const total = (qty * product.price).toFixed(2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  const close = () => {
    setQty(1);
    setPd("");
    setDone(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/70 p-4"
      onClick={close}
    >
      <div
        className="w-full max-w-lg bg-background border-2 border-foreground brut-shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-foreground px-5 py-3">
          <div className="font-mono text-[10px] uppercase tracking-widest">
            ▍ Commande rapide — {product.id}
          </div>
          <button
            onClick={close}
            className="font-mono text-xs uppercase tracking-widest hover:text-signal"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {!done ? (
          <form onSubmit={submit} className="p-5 space-y-5">
            <div className="flex gap-4">
              {PRODUCT_IMAGES[product.id] && (
                <img
                  src={PRODUCT_IMAGES[product.id]}
                  alt={product.name}
                  className="w-24 h-24 object-cover border-2 border-foreground"
                />
              )}
              <div className="flex-1">
                <h3 className="display text-2xl leading-tight">{product.name}</h3>
                <div className="font-mono text-xs opacity-70 mt-1">{product.producerName}</div>
                <div className="display text-2xl mt-2">
                  {product.price.toFixed(2)}
                  <span className="text-sm ml-1">€/{product.unit}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest block mb-2">
                Quantité ({product.unit}) — max {product.available}
              </label>
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="border-2 border-foreground px-4 py-2 font-mono"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={product.available}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.min(product.available, Math.max(1, Number(e.target.value) || 1)))
                  }
                  className="border-y-2 border-foreground px-3 py-2 w-20 text-center font-mono bg-background"
                />
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.available, q + 1))}
                  className="border-2 border-foreground px-4 py-2 font-mono"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest block mb-2">
                Point de distribution
              </label>
              <select
                value={selectedPd}
                onChange={(e) => setPd(e.target.value)}
                className="w-full border-2 border-foreground bg-background px-3 py-2 font-mono text-sm"
              >
                {product.pds.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-2 border-foreground p-3 flex items-center justify-between font-mono text-sm">
              <span className="uppercase tracking-widest text-xs">Total promesse</span>
              <span className="display text-2xl">{total} €</span>
            </div>

            <button
              type="submit"
              className="w-full bg-signal text-signal-foreground border-2 border-foreground px-5 py-3 font-mono text-xs uppercase tracking-widest brut-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Confirmer la promesse →
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="display text-6xl text-signal">✓</div>
            <h3 className="display text-2xl">Promesse enregistrée.</h3>
            <p className="font-mono text-sm opacity-80">
              {qty} × {product.name}
              <br />
              Retrait : {selectedPd}
              <br />
              Montant gelé : <strong>{total} €</strong>
            </p>
            <button
              onClick={close}
              className="border-2 border-foreground px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-signal hover:text-signal-foreground"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
