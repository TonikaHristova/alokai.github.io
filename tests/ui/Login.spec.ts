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
  await pm.onLoginPage().obtainNewUser()
})

test.beforeEach(async ({ }) => {
  await pm.onHomePage().setLocationCurrencyCookie()
  await pm.onLoginPage().goToLoginPage()
})

test('SAQA-10 Scenario 3: Attempt to login with not valid data', async ({ }) => {
  const data = [[Users.notValidEmail, Users.password], [Users.randomUserEmail, Users.notValidPassword]]
  await pm.onLoginPage().attemptToLogInUsersWithInvalidData(data)
})

test('SAQA-10 Scenario 1: Login with newly created user', async ({ }) => {
  await pm.onLoginPage().goToRegisterPage()
  await pm
    .onRegistrationPage()
    .registerNewUser(Users.randomUserFirstName, Users.randomUserLastName, Users.randomUserEmail, Users.password)
  await pm.onRegistrationPage().assertLoggedInUser(Users.randomUserFirstName)
  await pm.onLoginPage().logOut()
  await pm.onLoginPage().logIn(Users.randomUserEmail, Users.password)
  await pm.onRegistrationPage().assertLoggedInUser(Users.randomUserFirstName)
})


//this scenario is commented out for now as this functionality is not working yet due to SAQA-29
// test('SAQA-10 Scenario 4: Trigger the forgot password journey from the login page', async ({ }) => {
//   await pm.onLoginPage().goToLoginPage()
//   await pm.onLoginPage().resetYourPassword(Users.randomUserEmail)
// })
