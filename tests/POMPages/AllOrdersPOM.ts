import BasePOM  from "./BasePOM";

class AllOrdersPOM extends BasePOM{
    // Locators
    private newOrderNumber = () => this.page.locator("td[data-title='Order'] a");
    public orderTable = () => this.page.locator('.woocommerce-orders-table');

    async getLatestOrder () {
        // gets the 'first' latest order top
        const newOrderNo = await this.newOrderNumber().first().textContent();
        return newOrderNo?.trim().replace("#","");
    }
}

export default AllOrdersPOM;
