import BasePOM from "./BasePOM";
class OrderInfoPOM extends BasePOM {
    // Locators
    private orderNumber = () => this.page.locator(".order strong");

    /* Gets the order number from the order confirmation page. */
    async getOrderNumber(): Promise<string|null> {
        const orderNum = await this.orderNumber().textContent();
        return orderNum;
    }
}

export default OrderInfoPOM;
