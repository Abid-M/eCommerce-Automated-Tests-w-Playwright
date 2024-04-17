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
        const orderNum = await this.orderNumber().textContent();
        console.log(`New Order Number: ${orderNum}`)

        return orderNum;
    }
}

export default OrderInfoPOM;