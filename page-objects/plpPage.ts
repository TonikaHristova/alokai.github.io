import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './basePage'
import { localization } from '../src/utils/localization'

export class PLPPage extends BasePage {
  readonly title: Locator
  readonly productSection: Locator
  readonly sortingSection: Locator
  readonly facetSection: Locator
  readonly productResults: Locator
  readonly productCard: Locator
  readonly productPrice: Locator
  readonly facetByColorGreen: Locator
  readonly clearFacetsButton: Locator

  constructor(page: Page) {
    super(page)
    this.title = page.getByTestId('category-title')
    this.productSection = page.getByTestId('category-grid')
    this.sortingSection = page.getByTestId('select-input')
    this.facetSection = page.getByTestId('list-settings-item').last()
    this.productResults = page.getByTestId('products-count')
    this.productCard = page.getByTestId('product-card-vertical')
    this.productPrice = page.getByTestId('special-price')
    this.facetByColorGreen = page.locator('[data-testid="color-list-item-menu-label"]:has-text("Green")')
    this.clearFacetsButton = page.getByTestId('clear-all-filters-button')
  }

  async assertPLPTshirtPage() {
    await expect(this.page).toHaveTitle(localization.tshirtPLPTitle)
  }

  async assertProductSectionIsVisible() {
    await expect(this.productSection).toBeVisible()
  }

  async assertSortingSectionIsVisible() {
    await expect(this.sortingSection).toBeVisible()
  }

  async assertFacetSectionIsVisible() {
    await expect(this.facetSection).toBeVisible()
  }

  async assertProductsCount() {
    let productsCountLabel = await this.productResults.textContent()
    const count = productsCountLabel!.split(' ')
    productsCountLabel = count[0]
    const realCount = await this.productCard.count()
    expect(realCount).toBe(+productsCountLabel)
  }

  async sortBy(selectOption: string) {
    await this.sortingSection.selectOption(selectOption)
    await this.page.waitForLoadState('networkidle')
  }

  async assertSortingByPriceAcs() {
    const productPrices = await this.productPrice.allInnerTexts()

    const prices = productPrices.map(priceText => {
      return parseFloat(priceText.replace('£', ''))
    })

    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1])
    }
  }

  async fiterByGreenColor() {
    const expectedProductCountAfterFiltering = (await this.facetByColorGreen.locator('..').innerText()).match('\\d+')
    console.log(expectedProductCountAfterFiltering)
    await this.facetByColorGreen.locator('..').click()
    await this.page.waitForURL(localization.greenColourUrl)
    await this.page.waitForLoadState('networkidle')
    return expectedProductCountAfterFiltering![0]
  }

  async assertAllProductsAreVisibleWhenFacetIsRemoved(expectedCountAfterFiltering: string) {
    await this.clearFacetsButton.click()
    await this.page.waitForLoadState('networkidle')
    const productNamesRemovedFilter = (await this.productName.count()).toString()
    const productCountRemovedFilter = await this.productResults.textContent()
    expect(productNamesRemovedFilter).toEqual(productCountRemovedFilter!.match('\\d+')![0])
    expect(productCountRemovedFilter).not.toEqual(expectedCountAfterFiltering)
  }
}
