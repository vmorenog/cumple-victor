import { z } from "zod";
import {
  ALERGIA_VALUES,
  BEBIDA_VALUES,
  GUEST_VALUES,
  POSTRE_VALUES,
  PRINCIPAL_VALUES,
} from "./data";

export const reservationInputSchema = z.object({
  guestName: z.enum(GUEST_VALUES as [string, ...string[]], {
    errorMap: () => ({ message: "Elige tu nombre de la lista." }),
  }),
  principal: z.enum(PRINCIPAL_VALUES as [string, ...string[]], {
    errorMap: () => ({ message: "Elige un principal." }),
  }),
  postre: z.enum(POSTRE_VALUES as [string, ...string[]], {
    errorMap: () => ({ message: "Elige un postre." }),
  }),
  bebida: z.enum(BEBIDA_VALUES as [string, ...string[]], {
    errorMap: () => ({ message: "Elige una bebida." }),
  }),
  alergiasChips: z
    .array(z.enum(ALERGIA_VALUES as [string, ...string[]]))
    .default([]),
  alergiasOtras: z.string().max(500).default(""),
  nota: z.string().max(1000).default(""),
});

export type ReservationInput = z.infer<typeof reservationInputSchema>;

export interface Reservation extends ReservationInput {
  id: string;
  createdAt: number;
  updatedAt: number;
}
