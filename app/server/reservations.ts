import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "./db/client";
import { reservations } from "./db/schema";
import { reservationInputSchema, type Reservation } from "~/lib/schema";
import { notifyByEmail } from "./email";

function rowToReservation(
  row: typeof reservations.$inferSelect,
): Reservation {
  let chips: string[] = [];
  try {
    const parsed = JSON.parse(row.alergiasChips);
    if (Array.isArray(parsed))
      chips = parsed.filter((x) => typeof x === "string");
  } catch {
    chips = [];
  }
  return {
    id: row.id,
    guestName: row.guestName,
    principal: row.principal,
    postre: row.postre,
    bebida: row.bebida,
    alergiasChips: chips,
    alergiasOtras: row.alergiasOtras,
    nota: row.nota,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Devuelve la reserva de un invitado (o null). Se usa para prellenar. */
export const getReservationByName = createServerFn({ method: "GET" })
  .validator((raw: unknown) => {
    const parsed = reservationInputSchema
      .pick({ guestName: true })
      .safeParse(raw);
    if (!parsed.success) {
      throw new Error("Nombre inválido.");
    }
    return parsed.data;
  })
  .handler(async ({ data }): Promise<Reservation | null> => {
    const rows = await db
      .select()
      .from(reservations)
      .where(eq(reservations.guestName, data.guestName))
      .limit(1);
    const row = rows[0];
    return row ? rowToReservation(row) : null;
  });

/** Crea o actualiza (upsert) la reserva del invitado. Notifica por email. */
export const upsertReservation = createServerFn({ method: "POST" })
  .validator((raw: unknown) => reservationInputSchema.parse(raw))
  .handler(async ({ data }): Promise<{ ok: true; isUpdate: boolean }> => {
    const now = Date.now();

    const existing = await db
      .select()
      .from(reservations)
      .where(eq(reservations.guestName, data.guestName))
      .limit(1);

    const chipsJson = JSON.stringify(data.alergiasChips);
    const isUpdate = existing.length > 0;

    if (isUpdate) {
      await db
        .update(reservations)
        .set({
          principal: data.principal,
          postre: data.postre,
          bebida: data.bebida,
          alergiasChips: chipsJson,
          alergiasOtras: data.alergiasOtras,
          nota: data.nota,
          updatedAt: now,
        })
        .where(eq(reservations.guestName, data.guestName));
    } else {
      await db.insert(reservations).values({
        id: crypto.randomUUID(),
        guestName: data.guestName,
        principal: data.principal,
        postre: data.postre,
        bebida: data.bebida,
        alergiasChips: chipsJson,
        alergiasOtras: data.alergiasOtras,
        nota: data.nota,
        createdAt: now,
        updatedAt: now,
      });
    }

    await notifyByEmail({ reservation: data, isUpdate });

    return { ok: true, isUpdate };
  });

/** Admin: devuelve todas las reservas si el token coincide. */
export const listReservationsAdmin = createServerFn({ method: "GET" })
  .validator((raw: unknown) => {
    if (typeof raw !== "object" || raw === null || !("token" in raw)) {
      throw new Error("Token requerido.");
    }
    const token = (raw as { token: unknown }).token;
    if (typeof token !== "string") {
      throw new Error("Token inválido.");
    }
    return { token };
  })
  .handler(async ({ data }): Promise<Reservation[]> => {
    const expected = process.env.ADMIN_TOKEN;
    if (!expected) {
      throw new Error("ADMIN_TOKEN no configurado en el servidor.");
    }
    if (data.token !== expected) {
      throw new Error("Token incorrecto.");
    }
    const rows = await db.select().from(reservations);
    return rows
      .map(rowToReservation)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  });
