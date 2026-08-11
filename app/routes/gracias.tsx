import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Crest, Flourish } from "~/components/icons";

const searchSchema = z.object({
  // Aceptamos "true"/"1" o boolean directo desde la URL o la navegación.
  updated: z
    .union([z.boolean(), z.literal("true"), z.literal("1"), z.literal(1)])
    .optional()
    .transform((v) => v === true || v === "true" || v === "1" || v === 1),
});

export const Route = createFileRoute("/gracias")({
  validateSearch: (raw) => searchSchema.parse(raw),
  component: GraciasPage,
});

function GraciasPage() {
  const { updated } = Route.useSearch();

  return (
    <div className="card rotate-[-0.4deg] text-center relative overflow-hidden">
      <Crest className="mx-auto mb-3 h-[76px] w-[76px] text-terracotta" />

      <span className="eyebrow block mb-3">
        {updated ? "Respuesta actualizada" : "Reserva recibida"}
      </span>

      <h1 className="font-serif font-bold uppercase text-ink text-[clamp(28px,6vw,36px)] tracking-[0.02em] leading-[1.05] text-balance">
        ¡Gracias!
      </h1>

      <p className="mx-auto mt-4 max-w-[42ch] font-serif text-[16px] text-ink-2 leading-[1.55]">
        {updated
          ? "Hemos guardado tus cambios. Víctor recibirá el aviso."
          : "Tu menú está anotado. Víctor recibirá el aviso al momento y todos podremos comer felices."}
      </p>

      <Flourish className="mx-auto mt-6 block max-w-[220px] text-olive opacity-80" />

      <div className="mt-6 flex justify-center">
        <Link to="/" className="ghost-btn">
          ← Cambiar mi respuesta
        </Link>
      </div>

      <p className="mt-8 font-serif italic text-[14px] text-ink-mute">
        Nos vemos pronto en Casa Obdulia by Slam. 🎂
      </p>
    </div>
  );
}
