import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useMemo } from "react";
import { listReservationsAdmin } from "~/server/reservations";
import { GUESTS, PRINCIPALES, POSTRES, BEBIDAS } from "~/lib/data";
import { formatDateTime } from "~/lib/utils";
import type { Reservation } from "~/lib/schema";

const searchSchema = z.object({
  token: z.string().optional().default(""),
});

export const Route = createFileRoute("/admin")({
  validateSearch: (raw) => searchSchema.parse(raw),
  component: AdminPage,
});

function AdminPage() {
  const { token } = Route.useSearch();

  const query = useQuery({
    queryKey: ["admin-reservations", token],
    queryFn: () => listReservationsAdmin({ data: { token } }),
    enabled: token.length > 0,
    retry: false,
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="card">
        <span className="eyebrow block mb-2 text-center">Backoffice</span>
        <h1 className="section-title mb-2">Reservas</h1>
        <p className="text-center font-serif italic text-[14px] text-ink-mute">
          Cumple Víctor · Casa Obdulia by Slam
        </p>

        {!token ? (
          <p className="mx-auto mt-5 max-w-[46ch] text-center font-serif text-[15px] text-ink-2">
            Añade tu token en la URL:{" "}
            <code className="rounded bg-card-light px-2 py-0.5 font-mono text-[13px] text-terracotta-dark">
              /admin?token=…
            </code>
          </p>
        ) : query.isPending ? (
          <p className="mt-4 text-center font-serif italic text-ink-mute">
            Cargando…
          </p>
        ) : query.error ? (
          <p className="mt-4 text-center font-mono text-[12px] uppercase tracking-[0.16em] text-terracotta-dark">
            {query.error.message}
          </p>
        ) : (
          <Summary reservations={query.data ?? []} />
        )}
      </header>

      {query.data && query.data.length > 0 ? (
        <>
          <ReservationTable reservations={query.data} />
          <PendingGuests reservations={query.data} />
          <BreakdownCard reservations={query.data} />
          <ExportCard reservations={query.data} />
        </>
      ) : null}
    </div>
  );
}

function Summary({ reservations }: { reservations: Reservation[] }) {
  const total = GUESTS.length;
  const responded = reservations.length;
  const pending = total - responded;

  return (
    <div className="mx-auto mt-5 grid max-w-[420px] grid-cols-3 gap-3 text-center">
      <StatTile label="Respondidas" value={responded} accent="terracotta" />
      <StatTile label="Pendientes" value={pending} accent="olive" />
      <StatTile label="Total" value={total} accent="ink" />
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "terracotta" | "olive" | "ink";
}) {
  const colorClass =
    accent === "terracotta"
      ? "text-terracotta"
      : accent === "olive"
        ? "text-olive"
        : "text-ink";
  return (
    <div className="rounded-xl border border-dashed border-line/70 bg-card-light py-3">
      <div className={`font-serif font-bold text-3xl ${colorClass}`}>
        {value}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
        {label}
      </div>
    </div>
  );
}

function ReservationTable({ reservations }: { reservations: Reservation[] }) {
  return (
    <section className="card">
      <h2 className="section-title mb-4">Detalle</h2>
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full min-w-[560px] border-separate border-spacing-0 font-serif text-[14px] text-ink">
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Principal</Th>
              <Th>Postre</Th>
              <Th>Bebida</Th>
              <Th>Alergias</Th>
              <Th>Nota</Th>
              <Th>Actualizado</Th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => {
              const allergies = [
                ...r.alergiasChips,
                ...(r.alergiasOtras ? [r.alergiasOtras] : []),
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <tr key={r.id} className="align-top">
                  <Td>
                    <span className="font-bold text-ink">{r.guestName}</span>
                  </Td>
                  <Td>{r.principal}</Td>
                  <Td>{r.postre}</Td>
                  <Td>{r.bebida}</Td>
                  <Td>
                    <span
                      className={
                        allergies ? "text-terracotta-dark" : "text-ink-mute"
                      }
                    >
                      {allergies || "—"}
                    </span>
                  </Td>
                  <Td>
                    <span className="italic text-ink-mute">
                      {r.nota || "—"}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[11px] text-ink-mute">
                      {formatDateTime(r.updatedAt)}
                    </span>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PendingGuests({ reservations }: { reservations: Reservation[] }) {
  const responded = new Set(reservations.map((r) => r.guestName));
  const pending = GUESTS.filter((g) => !responded.has(g));

  if (pending.length === 0) {
    return (
      <section className="card text-center">
        <h2 className="section-title mb-2">¡Todos respondieron!</h2>
        <p className="font-serif italic text-ink-mute">
          No queda nadie por confirmar. 🎉
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="section-title mb-3">Pendientes ({pending.length})</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {pending.map((g) => (
          <span
            key={g}
            className="rounded-full border border-dashed border-terracotta bg-terracotta/5 px-3 py-1 font-serif text-[14px] text-terracotta-dark"
          >
            {g}
          </span>
        ))}
      </div>
    </section>
  );
}

function BreakdownCard({ reservations }: { reservations: Reservation[] }) {
  const counts = useMemo(() => {
    return {
      principal: countBy(reservations, "principal"),
      postre: countBy(reservations, "postre"),
      bebida: countBy(reservations, "bebida"),
    };
  }, [reservations]);

  return (
    <section className="card">
      <h2 className="section-title mb-4">Resumen para el restaurante</h2>
      <div className="grid gap-5">
        <Breakdown
          title="Principales"
          items={PRINCIPALES.map((p) => p.value)}
          counts={counts.principal}
        />
        <Breakdown
          title="Postres"
          items={[...POSTRES]}
          counts={counts.postre}
        />
        <Breakdown
          title="Bebidas"
          items={[...BEBIDAS]}
          counts={counts.bebida}
        />
      </div>
    </section>
  );
}

function Breakdown({
  title,
  items,
  counts,
}: {
  title: string;
  items: string[];
  counts: Record<string, number>;
}) {
  return (
    <div>
      <h3 className="mb-2 font-serif font-bold uppercase tracking-[0.2em] text-[12px] text-olive">
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => {
          const n = counts[item] ?? 0;
          return (
            <li
              key={item}
              className="flex items-baseline justify-between gap-3 border-b border-dotted border-line/50 pb-1 font-serif text-[15px]"
            >
              <span className={n === 0 ? "text-ink-mute" : "text-ink"}>
                {item}
              </span>
              <span
                className={`font-mono text-[13px] tabular-nums ${
                  n === 0 ? "text-ink-mute" : "text-terracotta font-bold"
                }`}
              >
                {n}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ExportCard({ reservations }: { reservations: Reservation[] }) {
  const csv = useMemo(() => buildCsv(reservations), [reservations]);

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reservas-cumple-victor.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="card text-center">
      <h2 className="section-title mb-3">Export</h2>
      <button type="button" onClick={downloadCsv} className="ghost-btn">
        Descargar CSV
      </button>
    </section>
  );
}

function countBy<K extends keyof Reservation>(
  rows: Reservation[],
  field: K,
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const r of rows) {
    const v = String(r[field]);
    result[v] = (result[v] ?? 0) + 1;
  }
  return result;
}

function buildCsv(rows: Reservation[]): string {
  const header = [
    "Nombre",
    "Principal",
    "Postre",
    "Bebida",
    "Alergias",
    "Otras alergias",
    "Nota",
    "Actualizado",
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        escape(r.guestName),
        escape(r.principal),
        escape(r.postre),
        escape(r.bebida),
        escape(r.alergiasChips.join(" · ")),
        escape(r.alergiasOtras),
        escape(r.nota),
        escape(new Date(r.updatedAt).toISOString()),
      ].join(","),
    );
  }
  return lines.join("\n");
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-dashed border-line/70 pb-2 pr-3 pl-2 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-olive">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="border-b border-dotted border-line/40 py-3 pr-3 pl-2">
      {children}
    </td>
  );
}
