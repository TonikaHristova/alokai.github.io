import { test, BrowserContext, Page } from '@playwright/test'
import { PageManager } from '../../page-objects/pageManager'
import { Product } from '../../page-objects/basePage'
import { localization } from '../../src/utils/localization'
import { Users } from '../../utils/Users'

const searchQuery = localization.searchQuery
let pm: PageManager
let page: Page
let context: BrowserContext
let quantity: number
let data: Product

test.beforeAll(async ({ browser }) => {
    context = await browser.newContext()
    page = await context.newPage()
    pm = new PageManager(page)
    await pm.onRegistrationPage().obtainNewUser()
})

test.beforeEach(async ({ }) => {
    await pm.onHomePage().goToHomePage()
    await pm.onHomePage().changeCountryAndLanguage()
    await pm.onLoginPage().goToLoginPage()
    await pm.onRegistrationPage().goToRegisterPage()
    await pm
        .onRegistrationPage()
        .registerNewUser(Users.randomUserFirstName, Users.randomUserLastName, Users.randomUserEmail, Users.password)
    await pm.onRegistrationPage().assertLoggedInUser(Users.randomUserFirstName)
    data = await pm.onHomePage().searchForProduct(searchQuery)
    await pm.onSearchPage().addProductToBasket()
    await pm.onSearchPage().goToCartPage()
})


test('SAQA-21 Scenario 1: Register user and place an order', async ({ }) => {
    quantity = 1
    await pm.onCartPage().assertProductData(data.productName, data.productPrice, quantity.toString())
    await pm.onCartPage().assertProductLineItemPrice()
    await pm.onCartPage().assertCartTotalPrice()
    await pm.onCartPage().goToCheckOut()
    await pm.onCheckoutPage().assertCheckoutPage()
    await pm.onMyAccountPage().fillShippingData(localization.misterValue, localization.manhatanStreet, localization.newYorkCity, localization.phoneNumber, localization.validPostCode)
    await pm.onCartPage().assertCartTotalPrice()  //this needs to go to the base page maybe as it is used on cart page and on checkout page?
})
