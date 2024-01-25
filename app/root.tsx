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
import { Toaster } from 'sonner'

export async function loader({ request }: LoaderFunctionArgs) {
  const locale = await i18next.getLocale(request)
  return json({ locale }, {
    headers: { 'Set-Cookie': await i18nCookie.serialize(locale) }
  })
}

export const handle = {
  i18n: 'common'
}

import fontsCss from '../assets/fonts/fonts.css'
import globalCss from './shared/styles/global.css'
import tailwindCss from './shared/styles/tailwind.css'
import sonnerCss from './shared/styles/sonner.css'
import { i18nCookie } from '@/cookie'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: fontsCss },
  { rel: 'stylesheet', href: globalCss },
  { rel: 'stylesheet', href: tailwindCss },
  { rel: 'stylesheet', href: sonnerCss },
]

export default function App() {
  const { i18n } = useTranslation()
  const { locale } = useLoaderData<typeof loader>()
  useChangeLanguage(locale)
  
  return (
    <html lang={i18n.resolvedLanguage} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{'body {  margin: 0;  font-family: \'Session\', sans-serif;  background-color: #121212;  color: #fff;}'}</style>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta rel="description" content="Session bots directory website is a place to discover new bots created by Session developers community" />
        <meta property="og:site_name" content="Session Bots directory" />
        <meta property="og:description" content="Session bots directory website is a place to discover new bots created by Session developers community" />
        <Meta />
        <Links />
      </head>
      <body className='dark'>
        <NavBar />
        <main className='p-4 mt-20'>
          <Toaster richColors visibleToasts={1} />
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
