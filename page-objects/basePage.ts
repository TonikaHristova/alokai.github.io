import { Locator, Page, expect } from '@playwright/test'
import { Users } from '../utils/Users'
import { getUserData } from '../utils/RandomData'
import { localization } from '../src/utils/localization'

export interface Product {
  productName: string
  productPrice: string
}

export class BasePage {
  readonly page: Page
  readonly searchInput: Locator
  readonly searchButton: Locator
  readonly cartItems: Locator
  readonly registerButton: Locator
  readonly productName: Locator
  readonly productPrice: Locator
  readonly addToBasketButton: Locator
  readonly lineItemQuantity: Locator
  readonly lineItemSubtotalPrice: Locator
  readonly alert: Locator
  readonly welcomeMessage: Locator
  readonly myAccountSection: Locator
  readonly titleDropdown: Locator
  readonly firstNameField: Locator
  readonly lastNameField: Locator
  readonly goToCartButton: Locator
  readonly createAccountLink: Locator
  readonly logOutButton: Locator
  readonly createAccountButton: Locator
  readonly emailAddressFiеld: Locator
  readonly passField: Locator
  readonly errorAlert: Locator
  readonly createdAddress: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.getByTestId('input-field')
    this.searchButton = page.getByTestId('search-submit')
    this.cartItems = page.getByTestId('cartTotalPrice')
    this.productName = page.getByTestId('link')
    this.productPrice = page.getByTestId('special-price')
    this.addToBasketButton = page.getByTestId('add-to-cart-button')
    this.lineItemQuantity = page.getByTestId('quantity-selector-input')
    this.lineItemSubtotalPrice = page.getByTestId('cart-product-card-total')
    this.alert = page.getByTestId('alert-body')
    this.goToCartButton = page.getByTestId('cart-action')
    this.registerButton = page.getByTestId('account-action')
    this.welcomeMessage = page.locator('[data-testid="account-action"] span')
    this.myAccountSection = page.getByTestId('desktop-navigation-side-panel')
    this.titleDropdown = page.locator('select')
    this.firstNameField = page.getByTestId('first-name-input')
    this.lastNameField = page.getByTestId('last-name-input')
    this.createAccountLink = page.getByTestId('register-link')
    this.logOutButton = page.getByTestId('navigation-item-logout')
    this.createAccountButton = page.getByTestId('submit-button')
    this.emailAddressFiеld = page.getByTestId('email-input')
    this.passField = page.getByTestId('password-input')
    this.errorAlert = page.locator('form [role="alert"]')
    this.createdAddress = page.getByTestId('saved-address')

  }

  async goToHomePage() {
    await this.page.goto('/')
    await this.page.waitForLoadState('domcontentloaded')
    await expect(this.page).toHaveTitle(`${localization.title}`)
  }

  async generateRandomEmail() {
    const randomString = (Math.random() + 1).toString(36).substring(7)
    const email = `randomuser${randomString}@grr.la`
    console.log('Created account is: ' + email)

    Users.randomUserEmail = email
    return email
  }

  async obtainNewUser() {
    await this.generateRandomEmail()
    await getUserData()
  }

  async searchForProduct(searchQuery: string): Promise<Product> {
    await this.searchInput.fill(searchQuery)
    await this.searchButton.click()
    await this.page.waitForLoadState('load')
    await this.productName.first().waitFor()
    const productName = await this.productName.nth(0).innerText()
    const productPrice = await this.productPrice.nth(0).innerText()
    return { productName, productPrice }
  }

  async calculateSubtotalPrice(unitPrice: number, quantity: number) {
    return (unitPrice * quantity).toFixed(2)
  }

  async extractPriceFromString(price: Locator, index = 0) {
    const priceString = await price.nth(index).innerText()
    const newString = priceString.split('£')
    return Number(newString[1])
  }

  async getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
  }

  async goToLoginPage() {
    await this.registerButton.waitFor()
    await this.registerButton.click()
    await this.page.waitForURL(localization.loginUrl, { waitUntil: 'load' })
  }

  async goToRegisterPage() {
    await this.createAccountLink.waitFor()
    await this.createAccountLink.click()
    await this.page.waitForURL(localization.registerUrl)
  }

  async goToCartPage() {
    await this.goToCartButton.click()
    await this.page.waitForURL(localization.cartUrl)
    await this.page.waitForLoadState('load')
    await expect(this.alert).toHaveCount(0) //this will wait for the alert to disappear
  }

  async addProductToBasket(index = 0) {
    await this.addToBasketButton.nth(index).click()
    await this.assertAlertMessages(localization.cartAlertOnAddToBasket)
  }

  async assertProductLineItemPrice(index = 0) {
    const price = await this.extractPriceFromString(this.productPrice.nth(index))
    const quantity = Number(await this.lineItemQuantity.nth(index).inputValue())
    const subtotal = await this.calculateSubtotalPrice(price, quantity)
    const subtotalToLocaleString = Number(subtotal).toLocaleString()
    await expect(this.lineItemSubtotalPrice.nth(index)).toContainText(subtotalToLocaleString)
  }

  async assertAlertMessages(expectedMsg: string, alert: Locator = this.alert) {
    await alert.waitFor({ state: 'visible' })
    const msg = await alert.textContent()
    expect(msg).toContain(expectedMsg)
  }

  async getRandomElement(array: any) {
    return Math.floor(Math.random() * array.length)
  }

  async logOut() {
    await expect(this.alert).toHaveCount(0)
    await this.logOutButton.click()
    await expect(this.logOutButton).not.toBeVisible()
    await this.alert.waitFor()
    await this.assertAlertMessages(localization.loggedOutMessage)
  }

}
