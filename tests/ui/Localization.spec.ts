import { test } from '@playwright/test'
import { localization } from '../../src/utils/localization'

test('Check localization setup', async ({ page }) => {
  await page.goto(`/yacceleratorstorefront?site=apparel-${localization.env}`)
})
