import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {PhoenixProvider} from '@lightspeed-hospitality/phoenix-react'
import phoenixCss from "@lightspeed-hospitality/phoenix-core/dist/index.css";
import { LinksFunction } from "@remix-run/server-runtime";
// Explicitly import Phoenix' css bundle from core for your bundler to handle

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: phoenixCss },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Lato&display=swap' }
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
          <ScrollRestoration />
          <LiveReload />
          <PhoenixProvider>
            <Outlet />
          </PhoenixProvider>
          <Scripts />
      </body>
    </html>
  );
}
