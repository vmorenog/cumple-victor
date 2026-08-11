# Cumple Víctor · Casa Obdulia

App fullstack para gestionar las reservas del cumple.

- **Stack**: TanStack Start 1.120 (Vinxi + React 19 + Vite 6) · TanStack Router · TanStack Query · Turso (libSQL) + Drizzle · Resend · React Hook Form + Zod · Tailwind 3
- **Deploy**: Netlify (preset Nitro `netlify` en `app.config.ts`)
- **Idioma**: Español (es-ES)

## Rutas

| Ruta                 | Qué hace                                                 |
| -------------------- | -------------------------------------------------------- |
| `/`                  | Menú + formulario. Prellena si el invitado ya respondió. |
| `/gracias?updated=…` | Confirmación tras enviar.                                |
| `/admin?token=…`     | Panel con stats, tabla, pendientes, breakdown y CSV.     |

Las mutaciones van por **TanStack Start server functions** (`createServerFn`) — el mismo pattern que en `uvicuo-web` con TanStack Query.

## Estructura

```
app/
├── routes/           # __root, index, gracias, admin
├── components/       # hero, menu-preview, reservation-form, icons
├── lib/              # data (menú + invitados), schema (Zod), utils
├── server/
│   ├── db/           # Drizzle schema + client Turso
│   ├── email.ts      # Resend
│   └── reservations.ts  # createServerFn: upsert, getByName, listAdmin
├── router.tsx        # QueryClient + router
├── client.tsx        # hydrateRoot
├── ssr.tsx           # createStartHandler
└── styles.css        # Tailwind + estilos retro
```

Pinning: **todos** los sub-paquetes `@tanstack/*` van fijados a `1.120.x` en `overrides`/`resolutions` porque los rangos internos `^` resolverían a la nueva API sin Vinxi y no compilaría. No toques esas versiones a menos que vayas a portar toda la app al nuevo plugin de Vite.

---

## Setup local

### 1. Turso (base de datos)

```bash
# Instala la CLI si no la tienes
curl -sSfL https://get.tur.so/install.sh | bash

turso auth signup      # o `login`
turso db create cumple-victor
turso db show cumple-victor --url                # → TURSO_DATABASE_URL
turso db tokens create cumple-victor              # → TURSO_AUTH_TOKEN
```

### 2. Resend (email)

- https://resend.com → Sign up → **API Keys** → crea uno → `RESEND_API_KEY`
- Dev: usa `RESEND_FROM="Cumple Víctor <onboarding@resend.dev>"` (solo envía al email verificado en tu cuenta Resend).
- Prod: añade y verifica un dominio propio → cambia el `RESEND_FROM` al remitente que quieras (`cumple@tudominio.com`).

### 3. Variables de entorno

```bash
cp .env.example .env
# rellena: TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, RESEND_API_KEY, RESEND_FROM, NOTIFY_TO, ADMIN_TOKEN
```

Para el `ADMIN_TOKEN` genera algo random:

```bash
openssl rand -hex 24
```

### 4. Migra la DB y arranca

```bash
bun install
bun run db:push        # crea la tabla `reservations` en Turso
bun run dev            # http://localhost:3000
```

Prueba rápida:

- Abre `/`, elige tu nombre, rellena, envía.
- Comprueba `/gracias`.
- Abre `/admin?token=<tu-ADMIN_TOKEN>` — deberías ver tu respuesta.

---

## Deploy a Netlify

Preset ya configurado en `app.config.ts` (`server.preset: "netlify"`). El build de Vinxi genera:

- `dist/` → estáticos del cliente
- `.netlify/functions-internal/server/` → función Nitro que maneja SSR + server functions
- `dist/_redirects` → todas las rutas dinámicas van a la función

### Opción A — Git + Netlify UI (recomendado)

1. **Sube el repo a GitHub**:
   ```bash
   git init && git add . && git commit -m "cumple victor · initial"
   gh repo create cumple-victor --private --source=. --push   # o hazlo por UI
   ```
2. **Netlify → Add new site → Import from Git** → elige tu repo.
3. Netlify autodetecta:
   - Build command: `bun run build`
   - Publish directory: `dist`
   - Functions directory: `.netlify/functions-internal`
4. Site settings → **Environment variables** → añade **todas** las de `.env`:
   `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `RESEND_API_KEY`, `RESEND_FROM`, `NOTIFY_TO`, `ADMIN_TOKEN`.
5. Trigger deploy.

### Opción B — Netlify CLI

```bash
bunx netlify-cli login
bunx netlify-cli init                # crea el site
bun run build
bunx netlify-cli env:import .env     # sube todas las vars
bunx netlify-cli deploy --prod
```

Tu URL pública queda tipo `https://cumple-victor.netlify.app`. Custom domain: Site settings → Domain management.

---

## Cambiar a Cloudflare Pages / Vercel / Node

Vinxi (vía Nitro) soporta muchos targets. En `app.config.ts` cambia `preset`:

```ts
server: {
  preset: "cloudflare-pages",     // Cloudflare Pages
  // preset: "cloudflare-module",  // Cloudflare Workers
  // preset: "vercel",             // Vercel serverless
  // preset: "vercel-edge",        // Vercel edge
  // preset: "node-server",        // Node standalone (Fly, Railway, VPS)
}
```

**Ojo con Cloudflare** (Pages/Workers): el runtime es Workers (edge), así que `@libsql/client` tiene que ser `@libsql/client/web` (HTTP). El código actual usa el cliente Node por defecto — funciona en Netlify Functions y Vercel Node/Edge sin cambio; para Cloudflare hay que sustituir el import en `app/server/db/client.ts`:

```ts
import { createClient } from "@libsql/client/web"; // en vez de "@libsql/client"
```

---

## Comandos

| Script                | Qué hace                                         |
| --------------------- | ------------------------------------------------ |
| `bun run dev`         | Dev server con HMR (`http://localhost:3000`).    |
| `bun run build`       | Build de producción + Nitro para el preset dado. |
| `bun run start`       | Sirve el build en local para probar producción.  |
| `bun run typecheck`   | `tsc --noEmit`.                                  |
| `bun run db:push`     | Aplica el schema Drizzle a Turso (dev).          |
| `bun run db:generate` | Genera migración SQL.                            |
| `bun run db:studio`   | Drizzle Studio (GUI de la DB).                   |

## Diseño

Estética "invitación de taberna" (Casa Obdulia): fondo pergamino `#EFE3C4`, terracota `#C24A1E` para acentos, oliva `#5A6B2B` para líneas dashed, hero-tarjeta ligeramente rotada, sello circular tipo cera en el botón de envío, chips-pegatina para elegir plato. Serif (`Bookman Old Style` con fallback `Georgia`) para todo el contenido, monospace para labels y eyebrows.

Sin fuentes externas (no depende de Google Fonts) — todo con stack de sistema.

## Notas

- **Upsert por nombre**: la clave única en `reservations` es `guest_name`. Si alguien vuelve a abrir la app con su nombre, verá su respuesta anterior y podrá cambiarla.
- **Notificación email**: se envía por Resend en el `handler` del server function `upsertReservation`, awaited para que no muera el runtime serverless antes de completarse.
- **Admin token**: `/admin` requiere `?token=…` que coincida con `ADMIN_TOKEN`. No es auth real — es "security by obscurity" perfectamente válido para un uso familiar.
