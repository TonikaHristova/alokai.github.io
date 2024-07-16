import { BrowserContext, Page, test } from '@playwright/test'
import { Users } from '../../utils/Users'
import { PageManager } from '../../page-objects/pageManager'

let pm: PageManager
let context: BrowserContext
let page: Page

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
})

test('SAQA-9 Scenario 2: Attempt to register new users with invalid data', async ({ }) => {
  const data =
    [[Users.randomUserFirstName, Users.randomUserLastName, Users.randomUserEmail, Users.notValidPassword],
    [Users.randomUserFirstName, Users.randomUserLastName, Users.notValidEmail, Users.password],
    ['', Users.randomUserLastName, Users.randomUserEmail, Users.password],
    [Users.randomUserFirstName, '', Users.randomUserEmail, Users.password]]
  await pm.onRegistrationPage().attemptToRegisterUsersWithInvalidData(data)
})

test('SAQA-9 Scenario 1: Register new user with valid data', async ({ }) => {
  await pm
    .onRegistrationPage()
    .registerNewUser(Users.randomUserFirstName, Users.randomUserLastName, Users.randomUserEmail, Users.password)
  await pm.onRegistrationPage().assertLoggedInUser(Users.randomUserFirstName)
  const newTab1 = await context.newPage()
  await pm.onBackofficePage(newTab1).launchBackoffice()
})


