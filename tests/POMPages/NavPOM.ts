import MyAccountPOM from "./MyAccountPOM";
import { BasePOM, ShopPOM } from "./index.ts"

class NavPOM extends BasePOM {
    // Locators
    private shopLink = () => this.page.locator('#menu-main').getByRole('link', { name: 'Shop' });
    private cartLink = () => this.page.locator('#menu-main').getByRole('link', { name: 'Cart' });
    private accountLink = () => this.page.locator('#menu-main').getByRole('link', { name: 'My account' });
    private dismissBannerLink = () => this.page.getByRole("link", { name: "Dismiss" });

    /* Navigates to the shop page. */
    async goToShop(): Promise<ShopPOM> {
        await this.shopLink().click();

        return new ShopPOM(this.page);
    }

    /* Navigates to the cart page. */
    async goToCart() {
        await this.cartLink().click();
    }

    /* Navigates to the cart page. */
    async goToAccount() {
        await this.accountLink().click();

        return new MyAccountPOM(this.page);
    }

    /* Clicks the "Dismiss" link in the blue banner, if it is present. */
    async dismissBanner() {
        try {
            await this.dismissBannerLink().waitFor();
            await this.dismissBannerLink().click();
        } catch {
            // No Banner displayed
        }
    }
}

export default NavPOM;
