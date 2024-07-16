import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './basePage'


export class BackofficePage extends BasePage {
    readonly page: Page
    readonly usernameField: Locator
    readonly passwordField: Locator
    readonly logInButton: Locator
    readonly userSection: Locator
    readonly customersSection: Locator
    readonly searchBar: Locator

    constructor(page: Page) {
        super(page)
        this.page = page
        this.usernameField = page.locator('[name="j_username"]')
        this.passwordField = page.locator('[name="j_password"]')
        this.logInButton = page.locator('.login_btn')
        this.userSection = page.locator('tr[aria-label = "User"]')
        this.customersSection = page.locator('[aria-label = "Customers"]')
        this.searchBar = page.locator('input[placeholder="Type to search"]')
    }

    async launchBackoffice() {
        await this.page.goto(process.env.BACKOFFICE_URL!)
        await this.usernameField.fill(process.env.BACKOFFICE_USERNAME!)
        await this.passwordField.fill(process.env.BACOFFICE_PASSWORD!)
        await this.logInButton.click()
    }


    async assertNewUserIsCreated(userEmail: string) {
        await this.launchBackoffice()
        await this.userSection.screenshot({ animations: 'disabled' })
        await this.userSection.click({ force: true })
        await this.page.waitForTimeout(6000)
        await this.customersSection.waitFor({ state: "visible", timeout: 10000 })
        await this.customersSection.click({ force: true })
        await this.page.waitForLoadState('networkidle')
        await this.searchBar.waitFor({ state: 'visible', timeout: 10000 })
        await this.searchBar.fill(userEmail)
        await this.page.keyboard.press('Enter')
        await this.page.waitForLoadState('domcontentloaded')
        await expect(this.page.getByText(userEmail)).toBeVisible()
    }

}
