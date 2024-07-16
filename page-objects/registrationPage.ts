import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './basePage'
import { Users } from '../utils/Users'
import { localization } from '../src/utils/localization'

export class RegistrationPage extends BasePage {
  readonly repeatPassField: Locator
  readonly newsletterCheckbox: Locator
  readonly termAndConditionsCheckbox: Locator
  readonly registrationAlert: Locator
  readonly errorAlert: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    super(page)
    this.repeatPassField = page.locator('[name="checkPwd"]')
    this.newsletterCheckbox = page.getByTestId('newsletter-checkbox')
    this.termAndConditionsCheckbox = page.getByTestId('terms-checkbox')
    this.errorMessage = page.locator('div.has-error')
  }

  async registerNewUser(firstName: string, lastName: string, email: string, pass: string) {
    await this.firstNameField.fill(firstName)
    await this.lastNameField.fill(lastName)
    await this.emailAddressFiеld.fill(email)
    await this.passField.fill(pass)
    await this.assertCheckboxes()
    await this.createAccountButton.click()

  }

  async assertLoggedInUser(firstName: string) {
    await this.page.waitForLoadState('networkidle')
    await expect(this.alert).toHaveCount(0)
    await this.welcomeMessage.waitFor()
    await expect(this.welcomeMessage).toContainText(firstName)
    await this.myAccountSection.waitFor({ state: 'visible' })
    await expect(this.logOutButton).toHaveCount(1)
  }

  private async assertUserCantRegister() {
    await this.createAccountButton.click()
    expect(this.page.url).not.toBe(localization.loginUrl)
  }

  async attemptToRegisterUsersWithInvalidData(data: string[][]) {
    for (let details of data) {
      await this.registerNewUser(details[0], details[1], details[2], details[3])
      await this.assertUserCantRegister()
      await this.page.reload()
    }
  }

  async assertAllTitles() {
    const options = await this.page.$$eval('select option', titleValues => {
      return titleValues.map(option => option.textContent)
    })

    for (let i = 1; i < options.length; i++) {
      await this.titleDropdown.selectOption({ label: options[i] as string })
      await expect(this.titleDropdown).toContainText(options[i] as string)
    }
  }

  private async assertCheckboxes() {
    await this.termAndConditionsCheckbox.check()
    await expect(this.termAndConditionsCheckbox).toBeChecked()
    await this.newsletterCheckbox.check()
    await expect(this.newsletterCheckbox).toBeChecked()
  }
}
