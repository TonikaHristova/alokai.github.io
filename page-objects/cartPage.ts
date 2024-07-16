import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './basePage'
import { localization } from '../src/utils/localization'

export class CartPage extends BasePage {
  readonly title: Locator
  readonly productImage: Locator
  readonly productQuantity: Locator
  readonly productName: Locator
  readonly productPrice: Locator
  readonly productLineItemTotalPrice: Locator
  readonly checkoutButton: Locator
  readonly backToShoppingButton: Locator
  readonly totalItemsInCart: Locator
  readonly cartTotalValue: Locator
  readonly couponCodeField: Locator
  readonly applyCouponButton: Locator
  readonly removeButton: Locator
  readonly emptyCartTitle: Locator
  readonly appliedCouponMessage: Locator
  readonly removeCouponButton: Locator
  readonly discountValue: Locator
  readonly cartSubtotalValue: Locator
  readonly product: Locator

  constructor(page: Page) {
    super(page)
    this.title = page.getByTestId('cart-header').locator('h1')
    this.productImage = page.getByTestId('cart-product-card-image')
    this.productName = page.getByTestId('cart-product-card-title')
    this.productPrice = page.getByTestId('cart-product-card-price').getByTestId('special-price')
    this.productQuantity = page.getByTestId('quantity-selector-input')
    this.productLineItemTotalPrice = page.getByTestId('cart-product-card-total')
    this.checkoutButton = page.getByTestId('go-to-checkout')
    this.backToShoppingButton = page.getByTestId('cart-header').getByTestId('button')
    this.totalItemsInCart = page.getByTestId('total-in-cart')
    this.cartTotalValue = page.getByTestId('total')
    this.cartSubtotalValue = page.getByTestId('order-summary').getByTestId('special-price')
    this.couponCodeField = page.getByTestId('input-field')
    this.applyCouponButton = page.getByTestId('applyPromoCode').getByTestId('button')
    this.removeButton = page.getByTestId('cart-product-card-remove-btn')
    this.emptyCartTitle = page.getByTestId('empty-cart-logo').locator('h2')
    this.appliedCouponMessage = page.getByTestId('savings-tag')
    this.removeCouponButton = page.getByTestId('removePromoCode')
    this.discountValue = page.getByTestId('specialSavings')
    this.product = page.getByTestId('cart-product-card')
  }

  async deleteProduct() {
    await this.removeButton.click()
    await this.alert.waitFor()
    await expect(this.alert).toContainText(localization.updateCartMessage)
    await this.page.waitForLoadState('load')
  }

  async assertEmptyCart() {
    await expect(this.emptyCartTitle).toBeVisible()
    await expect(this.emptyCartTitle).toContainText(localization.emptyCartMessage)
    await expect(this.alert).toContainText(localization.updateCartMessage)
  }

  async changeProductQuantity(quantity: string, index = 0) {
    await expect(this.productQuantity.nth(index)).toBeVisible()
    await this.productQuantity.nth(index).scrollIntoViewIfNeeded()
    await this.productQuantity.nth(index).fill(quantity)
    await this.productQuantity.nth(index).blur()
    await this.alert.waitFor({ timeout: 5000 })
    await this.assertAlertMessages(localization.updateCartMessage)
  }

  async assertProductData(productName: string, productPrice: string, quantity: string) {
    await expect(this.productName).toContainText(productName)
    await expect(this.productPrice).toContainText(productPrice)
    expect(await this.productQuantity.inputValue()).toEqual(quantity)
  }

  async assertCartTotalPrice() {
    // Extract text content from each element
    let prices = await this.productLineItemTotalPrice.allInnerTexts()
    let cartSubtotal = 0
    for (let i = 0; i < prices.length; i++) {
      const pricesText = prices[i].split('£')
      cartSubtotal += Number(pricesText[1])
    }
    if ((await this.discountValue.count()) > 0) {
      const discountPrice = await this.extractPriceFromString(this.discountValue)
      const totalPrice = (cartSubtotal - discountPrice).toLocaleString()
      await expect(this.cartTotalValue).toContainText(totalPrice)
      await expect(this.cartSubtotalValue).toContainText(totalPrice)
    } else {
      const fixedSubtotalPrice = cartSubtotal.toLocaleString()
      await expect(this.cartTotalValue).toContainText(fixedSubtotalPrice)
      await expect(this.cartSubtotalValue).toContainText(fixedSubtotalPrice)
    }
  }

  async applyCoupon(couponCode: string, cartDiscount: string) {
    await this.page.waitForLoadState('load') //does not click the button without this line of code
    await this.couponCodeField.scrollIntoViewIfNeeded()
    await this.couponCodeField.fill(couponCode)
    await this.applyCouponButton.click()
    await expect(this.appliedCouponMessage).toBeVisible()
    await expect(this.removeCouponButton).toBeVisible()
    await expect(this.discountValue).toContainText(cartDiscount)
  }

  async changeQuantityAndAssertPrice(quantity: number) {
    const items = await this.product.all()
    for (const item in items) {
      await this.changeProductQuantity(quantity.toString(), +item)
      await this.assertProductLineItemPrice(+item)
    }
  }

  async clickBackToShoppingButton() {
    await this.backToShoppingButton.click()
    await this.page.waitForURL(localization.categoryUrl)
  }

  async goToCheckOut() {
    await this.checkoutButton.click()
    await this.page.waitForURL(localization.checkoutUrl)
  }
}
