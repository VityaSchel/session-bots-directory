import { RemixI18Next } from 'remix-i18next'
import Backend from 'i18next-fs-backend'
import { resolve } from 'node:path'
import i18n from './i18n'
import { i18nCookie } from './cookie'

const i18next = new RemixI18Next({
  detection: {
    cookie: i18nCookie,
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
    },
  },
  plugins: [Backend],
})

export default i18next