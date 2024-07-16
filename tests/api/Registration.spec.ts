import { test, expect, Page, BrowserContext } from '@playwright/test'
import { Users } from '../../utils/Users'
import { PageManager } from '../../page-objects/pageManager'

let pm: PageManager
let page: Page
let context: BrowserContext

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext()
  page = await context.newPage()
  pm = new PageManager(page)
})

test.beforeEach(async ({ }) => {
  await pm.onHomePage().obtainNewUser()
})

test('SAQA-11 Scenario 1: Register new user via API using valid credentials', async ({ }) => {
  await (await pm.onUserApi()).registerViaApi(Users.randomUserEmail, Users.password).then(resp => {
    expect(resp.status()).toBe(200)
  })
})

test('SAQA-11 Scenario 2: Register new user via API using invalid password format', async ({ }) => {
  await (await pm.onUserApi()).registerViaApi(Users.randomUserEmail, Users.notValidPassword).then(resp => {
    expect(resp.status()).toBe(400)
  })
})
