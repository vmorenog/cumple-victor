import { Crest, ReservaStamp } from "./icons";

export function Hero() {
  return (
    <header className="hero-card relative rotate-[-0.8deg] rounded-[22px] border border-dashed border-olive bg-card p-[30px_28px_28px] shadow-card text-center">
      <span
        className="pointer-events-none absolute inset-[6px] rounded-[16px] border border-olive/40"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute inset-[12px] rounded-[12px] border border-dotted border-olive/25"
        aria-hidden="true"
      />

      <ReservaStamp className="absolute top-[14px] right-[14px] w-[78px] h-[78px] rotate-[11deg] text-terracotta opacity-90" />

      <Crest className="mx-auto mb-2 block h-[68px] w-[68px] text-terracotta" />

      <span className="eyebrow block mb-3">Estás invitad@ a</span>

      <h1 className="font-serif font-bold uppercase text-ink leading-[1.05] tracking-[0.02em] text-[clamp(30px,6vw,40px)] text-balance">
        El cumple
        <span className="mx-2 block my-1.5 font-serif italic normal-case font-normal text-gold text-[0.55em] tracking-normal">
          de
        </span>
        Víctor
      </h1>

      <p className="mt-1.5 font-serif uppercase tracking-[0.14em] text-[20px] text-gold">
        Casa Obdulia
        <small className="mt-0.5 block font-serif italic normal-case text-sm tracking-normal text-olive">
          by Slam
        </small>
      </p>

      <p className="mx-auto mt-4 max-w-[44ch] text-[15px] leading-[1.55] text-ink-2">
        Reserva tu menú antes del gran día: elige principal, postre y bebida, y
        cuéntanos si tienes alguna alergia. Tu respuesta me llega directa. ✨
      </p>
    </header>
  );
}
