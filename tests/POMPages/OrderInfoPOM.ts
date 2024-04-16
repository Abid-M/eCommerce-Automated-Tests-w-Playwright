import { Page } from "@playwright/test";

class OrderInfoPOM {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    orderNumber = () => this.page.locator(".order strong");

    /* Gets the order number from the order confirmation page. */
    async GetOrderNumber() {
        console.log(`New Order Number: ${await this.orderNumber().textContent()}`)

        return await this.orderNumber().textContent();
    }
}

export default OrderInfoPOM;