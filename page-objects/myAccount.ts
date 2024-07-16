import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './basePage'
import { localization } from '../src/utils/localization'
import { Users } from '../utils/Users'

export class MyAccountPage extends BasePage {
  readonly updateButton: Locator
  readonly editNameButton: Locator
  readonly editEmailButton: Locator
  readonly editPasswordButton: Locator
  readonly saveButton: Locator
  readonly nameLabel: Locator
  readonly emailLabel: Locator
  readonly passLabel: Locator
  readonly currentPasswordField: Locator
  readonly newPasswordField: Locator
  readonly repeatPasswordField: Locator
  readonly shippingDetailsButton: Locator
  readonly addAddressButton: Locator
  readonly titleSelect: Locator
  readonly streetNameField: Locator
  readonly cityField: Locator
  readonly phoneField: Locator
  readonly zipCodeField: Locator
  readonly createdAddress: Locator
  readonly editAddressButton: Locator
  readonly deleteAddressButton: Locator
  readonly confirmDeletionButton: Locator

  constructor(page: Page) {
    super(page)
    this.updateButton = page.locator('button.btn-primary')
    this.editNameButton = page.getByTestId('account-data-name').getByTestId('button')
    this.editEmailButton = page.getByTestId('account-data-email').getByTestId('button')
    this.editPasswordButton = page.getByTestId('account-data-password').getByTestId('button')
    this.saveButton = page.getByTestId('modal').getByTestId('save')
    this.nameLabel = page.getByTestId('account-data-name').getByTestId('description-body')
    this.emailLabel = page.getByTestId('account-data-email').getByTestId('description-body')
    this.passLabel = page.getByTestId('account-data-password').getByTestId('description-body')
    this.currentPasswordField = page.getByTestId('current-password-input')
    this.newPasswordField = page.getByTestId('new-password-input')
    this.repeatPasswordField = page.getByTestId('confirm-password-input')
    this.shippingDetailsButton = page.getByTestId('navigation-item-shippingdetails')
    this.addAddressButton = page.getByTestId('add-address-button')
    this.titleSelect = page.getByTestId('title-select')
    this.streetNameField = page.getByTestId('street-name-input')
    this.cityField = page.getByTestId('city-input')
    this.phoneField = page.getByTestId('phone-input')
    this.zipCodeField = page.getByTestId('postal-code-input')
    this.editAddressButton = page.getByTestId('edit-address')
    this.deleteAddressButton = page.getByTestId('delete-address')
    this.confirmDeletionButton = page.getByTestId('confirm')
  }


  async updateName(updatedName: string) {
    await this.editNameButton.click()
    await this.firstNameField.waitFor()
    await this.firstNameField.fill(updatedName)
    await this.lastNameField.fill(Users.updatedLastName)
    await this.saveButton.click()
    await this.nameLabel.click()
    await expect(this.nameLabel).toContainText(`${updatedName} ${Users.updatedLastName}`)

  }
  // to be used when SAQA-28 is resolved
  // private async updateEmail() {
  //   const newEmail = await this.generateRandomEmail()
  //   await this.editEmailButton.click()
  //   await this.emailAddressFiеld.fill(newEmail)
  //   await this.saveButton.click()
  //   await expect(this.emailLabel).toContainText(newEmail)
  // }

  async updatePassword() {
    await this.editPasswordButton.click()
    await this.currentPasswordField.fill(Users.password)
    await this.newPasswordField.fill(Users.newPassword)
    await this.repeatPasswordField.fill(Users.newPassword)
    await this.saveButton.click()
    await expect(this.passLabel).toContainText('*****')
    await this.assertAlertMessages(localization.updatedPasswordMessage)
    Users.password = Users.newPassword
  }

  async addShippingAddress(title: string, street: string, city: string, phone: string, zip: string) {
    await this.shippingDetailsButton.waitFor()
    await this.shippingDetailsButton.click()
    await this.addAddressButton.click()
    await this.fillShippingData(title, street, city, phone, zip)


  }

  async fillShippingData(title: string, street: string, city: string, phone: string, zip: string) {
    await this.titleSelect.selectOption(title)
    await expect(this.titleSelect).toHaveValue(title)
    await this.firstNameField.fill(Users.randomUserFirstName)
    await this.lastNameField.fill(Users.randomUserLastName)
    await this.streetNameField.fill(street)
    await this.cityField.fill(city)
    await this.phoneField.fill(phone)
    await this.zipCodeField.fill(zip)
    await this.saveButton.click()
    await this.assertAlertMessages(localization.updatedAddressMessage)
    await expect(this.createdAddress).toBeVisible()
    const expextedSavedDate = `${title} ${Users.randomUserFirstName} ${Users.randomUserLastName}${street}, , ${city}, ${zip}US${phone} `
    await expect(this.createdAddress).toContainText(expextedSavedDate)
  }

  async editShippingData(title: string, street: string, city: string, phone: string, zip: string) {
    await this.editAddressButton.click()
    await this.fillShippingData(title, street, city, phone, zip)

  }

  async deleteShippingAddress() {
    await expect(this.alert).toHaveCount(0)
    await this.deleteAddressButton.click()
    await this.confirmDeletionButton.click()
    await this.assertAlertMessages(localization.deleteAddressMessage)
    await expect(this.createdAddress).not.toBeVisible()
  }
}
