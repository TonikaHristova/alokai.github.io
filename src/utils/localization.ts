import * as fs from 'fs'
import * as path from 'path'

const loadLocalization = (locale: string) => {
  const localePath = path.resolve(__dirname, `../../locales/${locale}.json`)

  if (!fs.existsSync(localePath)) {
    throw new Error(`Localization file for locale '${locale}' not found at '${localePath}'`)
  }

  return JSON.parse(fs.readFileSync(localePath, 'utf-8'))
}

const locale = process.env.LOCALE || 'en'
export const localization = loadLocalization(locale)
