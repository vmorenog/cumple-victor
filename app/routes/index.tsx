import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "~/components/hero";
import { MenuPreview } from "~/components/menu-preview";
import { ReservationForm } from "~/components/reservation-form";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <MenuPreview />
      <ReservationForm />
      <footer className="mt-2 text-center font-serif italic text-sm leading-[1.5] text-ink-mute">
        Con cariño, para el cumple de{" "}
        <strong className="not-italic text-ink-2">Víctor</strong>.
        <br />
        Casa Obdulia by Slam.
      </footer>
    </>
  );
}
