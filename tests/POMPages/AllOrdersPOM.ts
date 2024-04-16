import { Page } from "@playwright/test";

class AllOrdersPOM {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    newOrderNumber = () => this.page.locator("td[data-title='Order'] a");
    orderTable = () => this.page.locator('.woocommerce-orders-table');

    async GetLatestOrder () {
        // getting the 'first' latest order top
        const newOrderNo = await this.newOrderNumber().first().textContent();
        return newOrderNo?.trim().replace("#","");
    }
}

export default AllOrdersPOM;