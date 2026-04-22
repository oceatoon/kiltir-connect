// Mock data shared across pages — frontend-only, will move to backend.

export type Producer = {
  slug: string;
  name: string;
  zone: string;
  pds: string[];
  description: string;
  products: { name: string; price: string; unit: string; available: string }[];
  volume: string;
  categories: string[];
};

export const PRODUCERS: Producer[] = [
  {
    slug: "domaine-de-plourin",
    name: "Domaine de Plourin",
    zone: "Finistère Nord",
    pds: ["PD Brest Centre", "PD Morlaix Halles"],
    description: "Vergers conduits en agroforesterie depuis 2014. Cidre brut, jus pressés à froid.",
    products: [
      { name: "Pommes Reinette", price: "2.40", unit: "/kg", available: "180 kg" },
      { name: "Cidre brut 75cl", price: "4.10", unit: "/btl", available: "320 btl" },
      { name: "Jus de pomme 1L", price: "3.20", unit: "/L", available: "260 L" },
    ],
    volume: "1.2 t / mois",
    categories: ["Boissons", "Maraîchage"],
  },
  {
    slug: "ferme-kerouzy",
    name: "Ferme Kerouzy",
    zone: "Pays de Morlaix",
    pds: ["PD Morlaix Halles", "PD Lannion Quai"],
    description: "Maraîchage diversifié bio sur 4 ha. Œufs plein air de 200 poules.",
    products: [
      { name: "Panier légumes 5kg", price: "18.00", unit: "/panier", available: "40 paniers" },
      { name: "Œufs (par 6)", price: "2.80", unit: "/×6", available: "120 boîtes" },
    ],
    volume: "800 kg / mois",
    categories: ["Maraîchage", "Élevage"],
  },
  {
    slug: "moulin-de-kervern",
    name: "Moulin de Kervern",
    zone: "Centre Bretagne",
    pds: ["PD Carhaix Forum"],
    description: "Meunerie sur meule de pierre, blés paysans, levain naturel.",
    products: [
      { name: "Farine T80 1kg", price: "3.50", unit: "/kg", available: "200 kg" },
      { name: "Pain campagne 800g", price: "5.20", unit: "/pièce", available: "60 pièces" },
    ],
    volume: "450 kg / mois",
    categories: ["Boulange"],
  },
];

export type OrderStatus = "promesse" | "paiement" | "livraison" | "reception" | "annulee";

export type Order = {
  id: string;
  side: "consommateur" | "producteur";
  counterparty: string;
  items: string;
  amount: number;
  status: OrderStatus;
  date: string;
};

export const MOCK_ORDERS_CONSUMER: Order[] = [
  { id: "CMD-2841", side: "consommateur", counterparty: "Ferme Kerouzy", items: "Panier 5kg + Œufs ×12", amount: 23.6, status: "promesse", date: "2026-04-22" },
  { id: "CMD-2812", side: "consommateur", counterparty: "Moulin de Kervern", items: "Farine T80 ×3, Pain ×2", amount: 20.9, status: "paiement", date: "2026-04-19" },
  { id: "CMD-2790", side: "consommateur", counterparty: "Domaine de Plourin", items: "Cidre ×6", amount: 24.6, status: "livraison", date: "2026-04-15" },
  { id: "CMD-2752", side: "consommateur", counterparty: "GAEC Ar Yaouank", items: "Poulet 1.6kg", amount: 18.4, status: "reception", date: "2026-04-08" },
];

export const MOCK_ORDERS_PRODUCER: Order[] = [
  { id: "CMD-2841", side: "producteur", counterparty: "Marie B. (PD Morlaix)", items: "Panier 5kg + Œufs ×12", amount: 23.6, status: "promesse", date: "2026-04-22" },
  { id: "CMD-2839", side: "producteur", counterparty: "Yann L. (PD Morlaix)", items: "Panier 5kg ×2", amount: 36.0, status: "promesse", date: "2026-04-22" },
  { id: "CMD-2820", side: "producteur", counterparty: "Soaz K. (PD Lannion)", items: "Œufs ×24", amount: 11.2, status: "paiement", date: "2026-04-20" },
  { id: "CMD-2801", side: "producteur", counterparty: "Erwan T. (PD Morlaix)", items: "Panier 5kg", amount: 18.0, status: "livraison", date: "2026-04-17" },
];

export type WalletEntry = {
  id: string;
  date: string;
  label: string;
  type: "recharge" | "promesse" | "paiement" | "remboursement" | "virement";
  amount: number; // signed
};

export const MOCK_WALLET: { balance: number; pending: number; entries: WalletEntry[] } = {
  balance: 87.4,
  pending: 23.6,
  entries: [
    { id: "W-019", date: "2026-04-22", label: "Promesse — Ferme Kerouzy (CMD-2841)", type: "promesse", amount: -23.6 },
    { id: "W-018", date: "2026-04-19", label: "Paiement — Moulin de Kervern (CMD-2812)", type: "paiement", amount: -20.9 },
    { id: "W-017", date: "2026-04-15", label: "Recharge caisse commune", type: "recharge", amount: 50.0 },
    { id: "W-016", date: "2026-04-08", label: "Paiement — GAEC Ar Yaouank (CMD-2752)", type: "paiement", amount: -18.4 },
    { id: "W-015", date: "2026-04-01", label: "Recharge caisse commune", type: "recharge", amount: 100.0 },
  ],
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  promesse: "Promesse",
  paiement: "Paiement",
  livraison: "Livraison",
  reception: "Réception",
  annulee: "Annulée",
};
