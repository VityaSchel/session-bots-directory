import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { NavBar } from './widgets/navbar'

import fontsCss from 'src/assets/fonts/fonts.css'
import globalCss from './shared/styles/global.css'
import tailwindCss from './shared/styles/tailwind.css'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: fontsCss },
  { rel: 'stylesheet', href: globalCss },
  { rel: 'stylesheet', href: tailwindCss },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{'body {  margin: 0;  font-family: \'Session\', sans-serif;  background-color: #121212;  color: #fff;}'}</style>
        <Meta />
        <Links />
      </head>
      <body>
        <NavBar />
        <main className='p-4'>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
