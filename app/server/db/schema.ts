import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const reservations = sqliteTable("reservations", {
  id: text("id").primaryKey(),
  guestName: text("guest_name").notNull().unique(),
  principal: text("principal").notNull(),
  postre: text("postre").notNull(),
  bebida: text("bebida").notNull(),
  alergiasChips: text("alergias_chips").notNull().default("[]"),
  alergiasOtras: text("alergias_otras").notNull().default(""),
  nota: text("nota").notNull().default(""),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export type ReservationRow = typeof reservations.$inferSelect;
export type ReservationInsert = typeof reservations.$inferInsert;
