import { Page } from "@playwright/test";

class ShopPOM {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    addToCartButton = (item : string) => this.page.getByLabel(`Add “${item}” to your cart`);
    viewCartButton = () => this.page.getByTitle('View cart');


    /* AddToCart(string)
      - Clicks the "Add to Cart" button for the specified item.
    */
    async AddToCart(itemName : string) {
        await this.addToCartButton(itemName).click();
        console.log("Added to Cart");

        return this;
    }

    /* Navigates to the cart page. */
    async GoToCart() {
        await this.viewCartButton().first().click();
        console.log("Navigated to the Cart Page")
    }
}

export default ShopPOM;