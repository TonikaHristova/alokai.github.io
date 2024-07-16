import { test, BrowserContext, Page } from '@playwright/test'
import { PageManager } from '../../page-objects/pageManager'
import { Product } from '../../page-objects/basePage'
import { localization } from '../../src/utils/localization'

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
})

test.beforeEach(async ({}) => {
  await pm.onHomePage().setLocationCurrencyCookie()
  data = await pm.onHomePage().searchForProduct(searchQuery)
  await pm.onSearchPage().addProductToBasket()
  await pm.onSearchPage().goToCartPage()
})

test('SAQA-13 Scenario 1: Verify product data in cart page', async ({}) => {
  quantity = 1
  await pm.onCartPage().assertProductData(data.productName, data.productPrice, quantity.toString())
  await pm.onCartPage().assertProductLineItemPrice()
  await pm.onCartPage().assertCartTotalPrice()
})

test('SAQA-13 Scenario 2: Change quantity in cart', async ({}) => {
  quantity = await pm.onCartPage().getRandomNumber(2, 10)
  await pm.onCartPage().changeQuantityAndAssertPrice(quantity)
  await pm.onCartPage().assertCartTotalPrice()
})

test('SAQA-13 Scenario 3: Remove product from cart', async ({}) => {
  await pm.onCartPage().deleteProduct()
  await pm.onCartPage().assertEmptyCart()
})

test('SAQA-13 Scenario 4: Apply coupon to the cart', async ({}) => {
  await pm.onCartPage().applyCoupon(process.env.PROMO_CODE_FIX_CART_DISCOUNT!, process.env.SUMMER69_DISCOUNT_VALUE!)
  await pm.onCartPage().assertCartTotalPrice()
})

test('SAQA-13 Scenario 5: More than one item in cart', async ({}) => {
  quantity = await pm.onCartPage().getRandomNumber(2, 10)
  await pm.onCartPage().clickBackToShoppingButton()
  await pm.onSearchPage().addProductToBasket(1)
  await pm.onSearchPage().goToCartPage()
  await pm.onCartPage().changeQuantityAndAssertPrice(quantity)
  await pm.onCartPage().assertCartTotalPrice()
})
