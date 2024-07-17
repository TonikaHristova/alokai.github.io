import { devices, PlaywrightTestConfig } from '@playwright/test'
import * as fs from 'fs'
import { localization } from './src/utils/localization'

interface EnvConfig {
  baseURL: string
}

const loadConfig = (): EnvConfig => {
  const env = process.env.ENV || 'qa'
  const configPath = `./config/${env}.json`

  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file for environment '${env}' not found at '${configPath}'`)
  }

  return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
}

const envConfig = loadConfig()
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config()

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: [['html', { outputFolder: '.' }]],
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: envConfig.baseURL,
    locale: process.env.LOCALE || 'en',
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      Cookie: `vsf-locale=${localization.englishLanguageValue}; vsf-currency=${localization.britishPoundCurrency}`,
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      ...envConfig,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      ...envConfig,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      ...envConfig,
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // ...envConfig,
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    //   ...envConfig,
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
}

/* Run your local dev server before starting the tests */
// webServer: {
//   command: 'npm run start',
//   url: 'http://127.0.0.1:3000',
//   reuseExistingServer: !process.env.CI,
// },
export default config
