import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './basePage'
import { localization } from '../src/utils/localization'

export class LoginPage extends BasePage {
  readonly logInButton: Locator
  readonly forgotYourPasswordLink: Locator
  readonly emailAddressFieldResetPassword: Locator
  readonly resetPasswordPopUp: Locator
  readonly resetPasswordButton: Locator
  readonly sentEmailPopUp: Locator

  constructor(page: Page) {
    super(page)
    this.logInButton = page.locator('form .btn-primary')
    this.forgotYourPasswordLink = page.getByTestId('forgot-password-button')
    this.emailAddressFieldResetPassword = page.locator('[id="forgottenPwd.email"]')
    this.resetPasswordPopUp = page.locator('#cboxLoadedContent')
    this.resetPasswordButton = page.locator('#cboxLoadedContent button')
    this.sentEmailPopUp = page.locator('#cboxContent')
  }


  async logIn(email: string, pass: string) {
    await this.page.waitForURL(localization.loginUrl, { waitUntil: 'load' })
    await this.emailAddressFiеld.waitFor()
    await this.emailAddressFiеld.fill(email)
    await this.passField.fill(pass)
    await expect(this.alert).toHaveCount(0)
    await this.createAccountButton.click()
  }

  async resetYourPassword(email: string) {
    await this.forgotYourPasswordLink.click()
    await expect(this.resetPasswordPopUp).toBeVisible()
    await this.emailAddressFieldResetPassword.fill(email)
    await this.resetPasswordButton.click()
    await expect(this.sentEmailPopUp).toContainText(localization.passwordResetMessage)

  }

  async attemptToLogInUsersWithInvalidData(data: string[][]) {
    for (const credentials of data) {
      await expect(this.alert).toHaveCount(0)
      await this.logIn(credentials[0], credentials[1])
      await this.assertAlertMessages(localization.incorrectPasswordOrEmailMessage, this.errorAlert)
      await this.page.reload()
    }
  }
}
