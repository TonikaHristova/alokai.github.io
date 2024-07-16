import { APIRequestContext, Page, request } from '@playwright/test'
import { CartPage } from '../page-objects/cartPage'
import { SearchPage } from '../page-objects/searchPage'
import { RegistrationPage } from '../page-objects/registrationPage'
import { PLPPage } from './plpPage'
import { LoginPage } from '../page-objects/loginPage'
import { HomePage } from './homePage'
import { MyAccountPage } from './myAccount'
import { BackofficePage } from './backofficePage'
import { UserApiUtils } from '../utils/userAPI'
import { CheckoutPage } from './checkoutPage'

export class PageManager {
  private readonly page: Page
  private readonly cartPage: CartPage
  private readonly searchPage: SearchPage
  private readonly registrationPage: RegistrationPage
  private readonly plpPage: PLPPage
  private readonly homePage: HomePage
  private readonly loginPage: LoginPage
  private readonly myAccountPage: MyAccountPage
  private readonly apiContext: APIRequestContext
  private readonly checkoutPage: CheckoutPage

  constructor(page: Page) {
    this.page = page
    this.cartPage = new CartPage(this.page)
    this.searchPage = new SearchPage(this.page)
    this.registrationPage = new RegistrationPage(this.page)
    this.plpPage = new PLPPage(this.page)
    this.homePage = new HomePage(this.page)
    this.loginPage = new LoginPage(this.page)
    this.homePage = new HomePage(this.page)
    this.myAccountPage = new MyAccountPage(this.page)
    this.checkoutPage = new CheckoutPage(this.page)

  }

  onCartPage() {
    return this.cartPage
  }

  onSearchPage() {
    return this.searchPage
  }

  onRegistrationPage() {
    return this.registrationPage
  }

  onPLPPage() {
    return this.plpPage
  }

  onHomePage() {
    return this.homePage
  }

  onLoginPage() {
    return this.loginPage
  }

  onMyAccountPage() {
    return this.myAccountPage
  }
  onBackofficePage(tab: Page) {
    return new BackofficePage(tab)
  }
  async onUserApi(apiContext: APIRequestContext = this.apiContext) {
    apiContext = await request.newContext()
    return new UserApiUtils(apiContext)

  }

  onCheckoutPage() {
    return this.checkoutPage
  }


}