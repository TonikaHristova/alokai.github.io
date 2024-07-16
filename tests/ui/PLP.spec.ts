import { BrowserContext, Page, test } from '@playwright/test'
import { PageManager } from '../../page-objects/pageManager'
import { localization } from '../../src/utils/localization'

let pm: PageManager
let context: BrowserContext
let page: Page

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext()
  page = await context.newPage()
  pm = new PageManager(page)
})

test.beforeEach(async ({}) => {
  await pm.onHomePage().setLocationCurrencyCookie()
  await pm.onHomePage().goToPLPPage()
})

test('SAQA-15 Scenario 1: All of the sections are present', async ({}) => {
  await pm.onPLPPage().assertPLPTshirtPage()
  await pm.onPLPPage().assertProductSectionIsVisible()
  await pm.onPLPPage().assertSortingSectionIsVisible()
  await pm.onPLPPage().assertFacetSectionIsVisible()
  await pm.onPLPPage().assertProductsCount()
})

test('SAQA-15 Scenario 2: Sorting by price - ascending', async ({}) => {
  await pm.onPLPPage().sortBy(`${localization.ascendingPriceSortOption}`)
  await pm.onPLPPage().assertSortingByPriceAcs()
})

// This test is skipped due to an issue related to the filtering with facets described in
// https://greenlight-digital.atlassian.net/browse/SAQA-27
// If the issue gets fixed the skip can be removed and test will pass
test.skip('SAQA-15 Scenario 3: Filtering by facet', async ({}) => {
  const expectedProductCount = await pm.onPLPPage().fiterByGreenColor()
  await pm.onPLPPage().assertProductsCount()
  await pm.onPLPPage().assertAllProductsAreVisibleWhenFacetIsRemoved(expectedProductCount)
})
