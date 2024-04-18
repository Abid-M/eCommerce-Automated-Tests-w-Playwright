import { Page } from "@playwright/test";
import MyAccountPOM from "./MyAccountPOM";
import ShopPOM from "./ShopPOM";

class NavPOM {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    shopLink = () => this.page.locator('#menu-item-43').getByRole('link', { name: 'Shop' });
    cartLink = () => this.page.locator('#menu-item-44').getByRole('link', { name: 'Cart' })
    accountLink = () => this.page.locator('#menu-item-46').getByRole('link', { name: 'My account' })
    dismissBannerLink = () => this.page.getByRole("link", { name: "Dismiss" });

    /* Navigates to the shop page. */
    async GoToShop() {
        await this.shopLink().click();
        console.log("Navigated to the Shop Page")

        return new ShopPOM(this.page);
    }

    /* Navigates to the cart page. */
    async GoToCart() {
        await this.cartLink().click();
        console.log("Navigated to the Cart Page")
    }

    /* Navigates to the cart page. */
    async GoToAccount() {
        await this.accountLink().click();
        console.log("Navigated to the Account Page")

        return new MyAccountPOM(this.page);
    }

    /* Clicks the "Dismiss" link in the blue banner, if it is present. */
    async DismissBanner() {
        if (await this.dismissBannerLink().isVisible()) {
            await this.dismissBannerLink().click();
        } else {
            // No Banner displayed
        }
    }
}

export default NavPOM;
