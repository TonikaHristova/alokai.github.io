import { Locator, Page } from '@playwright/test'
import { BasePage } from './basePage'

export class SearchPage extends BasePage {
  readonly productName: Locator
  readonly productImage: Locator
  readonly productPrice: Locator

  constructor(page: Page) {
    super(page)
    this.productImage = page.getByTestId('image-with-placeholder-wrapper')
    this.productName = page.getByTestId('link')
    this.productPrice = page.locator('.special-price')
  }
}
