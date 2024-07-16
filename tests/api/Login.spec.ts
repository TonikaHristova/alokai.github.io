import { test, expect, Page, BrowserContext } from '@playwright/test'
import { Users } from '../../utils/Users'
import { localization } from '../../src/utils/localization'
import { PageManager } from '../../page-objects/pageManager'

let pm: PageManager
let page: Page
let context: BrowserContext


test.beforeAll(async ({ browser }) => {
  context = await browser.newContext()
  page = await context.newPage()
  pm = new PageManager(page)

})

test('SAQA-12 Scenario 1: Login user via API using valid credentials', async ({ }) => {
  await (await pm.onUserApi()).loginViaAPI(process.env.LOGIN_USER_EMAIL!, process.env.LOGIN_USER_PASSWORD!)
    .then(async resp => {
      expect(resp.status()).toBe(200)
      const responseJSON = await resp.json()
      expect(responseJSON.customer.email).toBe(process.env.LOGIN_USER_EMAIL!)
      expect(responseJSON.customer.id).not.toBeNull()
    })
})

test('SAQA-12 Scenario 2: Login user via API using invalid password', async ({ }) => {
  await (await pm.onUserApi()).loginViaAPI(process.env.LOGIN_USER_EMAIL!, Users.notValidPassword).then(async resp => {
    const responseJSON = await resp.json()
    expect(resp.status()).toBe(401)
    expect(responseJSON.message).toBe(localization.apiMsgOnFailedLogin)
  })
})
