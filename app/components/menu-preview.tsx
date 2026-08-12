import { POSTRES, PRINCIPALES } from "~/lib/data";

interface MenuItem {
  name: string;
  note?: string;
}

export function MenuPreview() {
  return (
    <section aria-labelledby="menu-title">
      <h2 id="menu-title" className="section-title">
        El menú
      </h2>
      <span className="mt-1 block text-center font-mono text-[11px] tracking-[0.2em] uppercase text-olive">
        — Casa Obdulia by Slam —
      </span>

      <MenuGroup title="Aperitivo" items={[{ name: "Aperitiu de la casa" }]} />

      <hr className="dashed-rule" />

      <MenuGroup
        title="Entrantes a compartir · 1 cada 4"
        items={[
          { name: "Pan de coca con tomate y AOVE" },
          { name: "Tabla de embutidos y quesos de Montserrat" },
          { name: "Huevos rotos de Enrique Tomás" },
          { name: "Chipirones a la andaluza con mayonesa cítrica" },
        ]}
      />

      <hr className="dashed-rule" />

      <MenuGroup
        title="Principales · a elegir uno"
        items={PRINCIPALES.map((p) => ({
          name: p.value,
          note: p.supp ?? undefined,
        }))}
      />

      <hr className="dashed-rule" />

      <MenuGroup
        title="Postres · a elegir uno"
        items={POSTRES.map((p) => ({ name: p }))}
      />

      <hr className="dashed-rule" />

      <MenuGroup
        title="Incluye"
        items={[
          { name: "Café" },
          {
            name: "Agua y refresco · o copa de cerveza · o botella de vino cada 4 (Fenomenal / Ca N'Estruc tinto)",
          },
        ]}
      />
    </section>
  );
}

function MenuGroup({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <div className="mt-5 first-of-type:mt-4">
      <h3 className="mb-3 text-center font-serif font-bold uppercase tracking-[0.24em] text-[13px] text-olive">
        {title}
      </h3>
      <ul className="m-0 list-none space-y-1 p-0">
        {items.map((item) => (
          <li
            key={item.name}
            className="py-1 text-center font-serif text-[16px] leading-[1.4] text-ink"
          >
            {item.name}
            {item.note ? (
              <span className="ml-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-terracotta">
                {item.note}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
