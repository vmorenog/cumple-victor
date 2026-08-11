import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Hero } from "~/components/hero";
import { ReservationForm } from "~/components/reservation-form";

const searchSchema = z.object({
  nombre: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: (raw) => searchSchema.parse(raw),
  component: HomePage,
});

function HomePage() {
  const { nombre } = Route.useSearch();
  return (
    <>
      <Hero />
      <ReservationForm initialGuestName={nombre} />
      <footer className="mt-2 text-center font-serif italic text-sm leading-[1.5] text-ink-mute">
        Con cariño, para el cumple de{" "}
        <strong className="not-italic text-ink-2">Víctor</strong>.
        <br />
        Casa Obdulia by Slam.
      </footer>
    </>
  );
}
