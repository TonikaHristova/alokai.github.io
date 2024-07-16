import { BrowserContext, Page, test, expect } from '@playwright/test'
import { PageManager } from '../../page-objects/pageManager'
import { Users } from '../../utils/Users'
import { localization } from '../../src/utils/localization'

let pm: PageManager
let context: BrowserContext
let page: Page
let updatedFirstName: string


test.beforeAll(async ({ browser }) => {
  context = await browser.newContext()
  page = await context.newPage()
  pm = new PageManager(page)
  updatedFirstName = (Math.random() + 1).toString(36).substring(7)

  await pm.onRegistrationPage().obtainNewUser()
  await (await pm.onUserApi()).registerViaApi(Users.randomUserEmail, Users.password).then(resp => {
    expect(resp.status()).toBe(200)
  })
})

test.beforeEach(async ({ }) => {
  await pm.onHomePage().setLocationCurrencyCookie()
  await pm.onHomePage().goToLoginPage()
  await pm.onLoginPage().logIn(Users.randomUserEmail, Users.password)
  await pm.onRegistrationPage().assertLoggedInUser(Users.randomUserFirstName)

})

test.afterEach(async ({ }) => {
  await pm.onMyAccountPage().logOut()
})


test('SAQA-18 Scenario 2: Add and delete shipping address, Scenario 4: Delete created address', async ({ }) => {
  await pm.onMyAccountPage().addShippingAddress(localization.misterValue, localization.manhatanStreet, localization.newYorkCity, localization.phoneNumber, localization.validPostCode)
  await pm.onMyAccountPage().deleteShippingAddress()
})

test('SAQA-18 Scenario 3: Add and edit shipping address', async ({ }) => {
  await pm.onMyAccountPage().addShippingAddress(localization.misterValue, localization.manhatanStreet, localization.newYorkCity, localization.phoneNumber, localization.validPostCode)
  await pm.onMyAccountPage().editShippingData(localization.misterValue, localization.bourbonStreet, localization.newOrleansCity, localization.updatedPhoneNumber, localization.updatedPostCode)
})

test('SAQA-18 Scenario 1: Update personal data', async ({ }) => {
  await pm.onMyAccountPage().updateName(updatedFirstName)
  await pm.onMyAccountPage().updatePassword()
  await pm.onMyAccountPage().logOut()
  await pm.onLoginPage().logIn(Users.randomUserEmail, Users.newPassword)
  await pm.onRegistrationPage().assertLoggedInUser(updatedFirstName)
})
