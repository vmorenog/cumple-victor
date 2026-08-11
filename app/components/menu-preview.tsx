import { Flourish } from "./icons";

export function MenuPreview() {
  return (
    <section className="card" aria-labelledby="menu-title">
      <h2 id="menu-title" className="section-title">
        El menú
      </h2>
      <span className="mt-1 block text-center font-mono text-[11px] tracking-[0.2em] uppercase text-olive">
        — Casa Obdulia by Slam —
      </span>

      <MenuGroup title="Aperitivo" items={["Aperitiu de la casa"]} />

      <hr className="dashed-rule" />

      <MenuGroup
        title="Entrantes a compartir · 1 cada 4"
        items={[
          "Pan de coca con tomate y AOVE",
          "Tabla de embutidos y quesos de Montserrat",
          "Huevos rotos de Enrique Tomás",
          "Chipirones a la andaluza con mayonesa cítrica",
        ]}
      />

      <hr className="dashed-rule" />

      <MenuGroup
        title="Incluye"
        items={[
          "Café",
          "Agua y refresco · o copa de cerveza · o botella de vino cada 4 (Fenomenal / Ca N'Estruc tinto)",
        ]}
      />

      <Flourish className="mx-auto mt-5 block max-w-[260px] text-olive opacity-80" />
    </section>
  );
}

function MenuGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5 first-of-type:mt-4">
      <h3 className="mb-3 text-center font-serif font-bold uppercase tracking-[0.24em] text-[13px] text-olive">
        {title}
      </h3>
      <ul className="m-0 list-none space-y-1 p-0">
        {items.map((item) => (
          <li
            key={item}
            className="py-1 text-center font-serif text-[16px] leading-[1.4] text-ink"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
