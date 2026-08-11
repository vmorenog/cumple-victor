// Datos estáticos del menú y la lista de invitados.
// Compartido entre cliente y servidor (validación).

export const GUESTS = [
  "Víctor",
  "Lydia",
  "Sandra",
  "Alen",
  "Inma",
  "Paco",
  "Angus",
  "Manel",
  "Judith",
  "Jose",
  "Isa",
  "Nando",
  "Ferran",
  "Yaya Mari Luz",
  "Adrià",
  "Blanca",
  "Jose Antonio",
  "Pedro",
  "Leli",
  "Rubén",
  "Merche",
] as const;

export type Guest = (typeof GUESTS)[number];

export interface PrincipalOption {
  value: string;
  supp: string | null;
}

export const PRINCIPALES: PrincipalOption[] = [
  { value: "Canelón de rustido tradicional", supp: null },
  { value: "Dorada a la brasa con ajada suave", supp: null },
  { value: "Milanesa Bela a la napolitana", supp: null },
  { value: "Arroz del senyoret", supp: "mín. 2 personas" },
  { value: "Solomillo de ternera con chalotas confitadas", supp: "supl. +5€" },
];

export const POSTRES = [
  "Tatín de manzana",
  "Espuma de tiramisú",
  "Yogur natural con fruta",
] as const;

export const BEBIDAS = [
  "Agua",
  "Refresco",
  "Copa de cerveza",
  "Vino tinto (Ca N'Estruc)",
  "Vino blanco (Fenomenal)",
] as const;

export const ALERGIAS = [
  "Gluten",
  "Lactosa",
  "Frutos secos",
  "Marisco",
  "Pescado",
  "Huevo",
  "Soja",
  "Vegetariano/a",
] as const;

export const PRINCIPAL_VALUES = PRINCIPALES.map((p) => p.value);
export const GUEST_VALUES = [...GUESTS];
export const POSTRE_VALUES = [...POSTRES];
export const BEBIDA_VALUES = [...BEBIDAS];
export const ALERGIA_VALUES = [...ALERGIAS];
