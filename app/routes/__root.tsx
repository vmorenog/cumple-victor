import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
  useRouterState,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/react-start";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import globalCss from "~/styles.css?url";

interface RouterAppContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "El cumple de Víctor · Casa Obdulia",
      },
      {
        name: "description",
        content:
          "Reserva tu menú para el cumple de Víctor en Casa Obdulia — elige plato, postre y bebida.",
      },
    ],
    links: [
      { rel: "stylesheet", href: globalCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  return (
    <RootDocument wide={pathname.startsWith("/admin")}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </RootDocument>
  );
}

function RootDocument({
  children,
  wide,
}: Readonly<{ children: ReactNode; wide?: boolean }>) {
  return (
    <html lang="es">
      <head>
        <Meta />
      </head>
      <body>
        <main
          className={`relative z-10 mx-auto flex flex-col gap-7 px-5 pt-8 pb-24 ${
            wide ? "max-w-[1100px]" : "max-w-[640px]"
          }`}
        >
          {children}
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
