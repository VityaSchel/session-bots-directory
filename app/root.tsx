import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from '@remix-run/react'
import { NavBar } from './widgets/navbar'
import { Footer } from './widgets/footer'
import { useChangeLanguage } from 'remix-i18next'
import { useTranslation } from 'react-i18next'
import i18next from './i18next.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request)
  return json({ locale })
}

export const handle = {
  i18n: 'common'
}

import fontsCss from '../assets/fonts/fonts.css'
import globalCss from './shared/styles/global.css'
import tailwindCss from './shared/styles/tailwind.css'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: fontsCss },
  { rel: 'stylesheet', href: globalCss },
  { rel: 'stylesheet', href: tailwindCss },
]

export default function App() {
  const { locale } = useLoaderData<typeof loader>()
  const { i18n } = useTranslation()
  useChangeLanguage(locale)
  
  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{'body {  margin: 0;  font-family: \'Session\', sans-serif;  background-color: #121212;  color: #fff;}'}</style>
        <Meta />
        <Links />
      </head>
      <body className='dark'>
        <NavBar />
        <main className='p-4 mt-20'>
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
