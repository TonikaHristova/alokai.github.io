import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './basePage'
import { localization } from '../src/utils/localization'

export class HomePage extends BasePage {
  readonly categoryButton: Locator
  readonly tshirtCategoryButton: Locator
  readonly regionPreferencesButton: Locator
  readonly languageSelect: Locator
  readonly currencySelect: Locator
  readonly regionPreferencesSaveButton: Locator

  constructor(page: Page) {
    super(page)
    this.categoryButton = page.getByTestId('category-index-link')
    this.tshirtCategoryButton = page.locator('[href*="250100"] span[data-testid=list-item-menu-label]')
    this.regionPreferencesButton = page.getByTestId('location-action')
    this.languageSelect = page.locator('select[data-testid="language-select"]')
    this.currencySelect = page.locator('select[data-testid="currency-select"]')
    this.regionPreferencesSaveButton = page.getByTestId('region-save-button')
  }

  async goToPLPPage() {
    await this.categoryButton.click()
    await this.page.waitForURL(localization.categoryURL)
    await this.tshirtCategoryButton.click()
    await this.page.waitForURL(localization.clothesURL)
    await this.page.waitForLoadState('load')
  }

  async changeCountryAndLanguage(
    languageValue: string = localization.englishLanguageValue,
    currencyValue: string = localization.britishPoundCurrency
  ) {
    await this.regionPreferencesButton.click()
    await this.languageSelect.waitFor()
    await this.languageSelect.selectOption(languageValue)
    await this.currencySelect.selectOption(currencyValue)
    await this.regionPreferencesSaveButton.click()
    await expect(this.regionPreferencesButton).toContainText(currencyValue)
  }

  async setLocationCurrencyCookie(value: string = localization.britishPoundCurrency) {
    await this.page
      .context()
      .addCookies([
        { name: 'vsf-currency', value, domain: 'brave-bison.europe-west1.gcp.storefrontcloud.io', path: '/' },
      ])
    await this.goToHomePage()
    await expect(this.regionPreferencesButton).toContainText(value!)
  }
}
