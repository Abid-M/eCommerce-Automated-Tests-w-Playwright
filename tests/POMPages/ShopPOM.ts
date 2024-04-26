import { expect } from "@playwright/test";
import CartPOM from "./CartPOM";
import products from "../Data/Products.json"
import BasePOM from "./BasePOM";

class ShopPOM extends BasePOM {
    // Locators
    private addToCartButton = (item: string) => this.page.getByLabel(`Add “${item}” to your cart`);
    private viewCartButton = () => this.page.getByTitle('View cart');
    private getProductViewCart = (product: string) => this.page.locator('li').filter({ hasText: `${product}` }).getByTitle('View cart');

    async checkItemsExists(): Promise<string> {
        let itemsNotFound: string [] = []

        for (const item of products) {
            if (item.AddToCart) {
                if (await this.addToCartButton(item.ProductName).isVisible()) {
                    console.log(`'${item.ProductName}' exists on the shop page..`)
                } else {
                    itemsNotFound.push(item.ProductName);
                }
            }
        }

        if (itemsNotFound.length == 0) {
            return "All Items from data file exists"
        } else {
            return itemsNotFound.join(", ") + " does not exist!";
        }
    }

    /* AddToCart(string)
      - Clicks the "Add to Cart" button for the specified item.
    */
    async addToCart(): Promise<string[]> {
        let addedItems: string [] = []

        for (const item of products) {
            if (item.AddToCart) {
                if (await this.addToCartButton(item.ProductName).isVisible()) {
                    await this.addToCartButton(item.ProductName).click();
                    console.log(`'${item.ProductName}' added to cart..`)
                    addedItems.push(item.ProductName);
                    
                    // Wait for view cart button to be visible before moving on
                    await expect(this.getProductViewCart(item.ProductName)).toBeVisible();
                }
            }
        }

        return addedItems;
    }

    /* Navigates to the cart page. */
    async goToCart() {
        await this.viewCartButton().first().click();

        return new CartPOM(this.page);
    }
}

export default ShopPOM;