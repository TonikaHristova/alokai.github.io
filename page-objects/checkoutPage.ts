import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './basePage'
import { Users } from '../utils/Users'

export class CheckoutPage extends BasePage {
    readonly contactInformationLabel: Locator
    readonly standardDeliveryOption: Locator
    readonly premiumDeliveryOption: Locator
    readonly creditCardPaymentOption: Locator
    readonly addShippingAddressButton: Locator
    readonly addNewAddressButton: Locator


    constructor(page: Page) {
        super(page)
        this.contactInformationLabel = page.getByTestId('customer-email')
        this.standardDeliveryOption = page.locator('[value="standard-gross"]')
        this.premiumDeliveryOption = page.locator('[value="premium-gross"]')
        this.creditCardPaymentOption = page.getByTestId('credit-card')
        this.addShippingAddressButton = page.getByTestId('add-button')
        this.addNewAddressButton = page.getByTestId('add-new-address')

    }

    async assertCheckoutPage() {
        await expect(this.contactInformationLabel).toContainText(Users.randomUserEmail)
        await expect(this.createdAddress).not.toBeVisible()
        await this.addShippingAddressButton.click()
        await this.addNewAddressButton.click()
    }
}