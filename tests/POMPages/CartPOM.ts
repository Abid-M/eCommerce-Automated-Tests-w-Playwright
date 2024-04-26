import { expect } from "@playwright/test";
import CheckoutPOM from "./CheckoutPOM";
import BasePOM from "./BasePOM";

class CartPOM extends BasePOM {
    // Locators
    private cartContent = () => this.page.locator('#content > div');
    private cartItems = () => this.page.locator("td.product-name");
    private couponCodeField = () => this.page.getByPlaceholder('Coupon code');
    private applyCouponButton = () => this.page.getByRole('button', { name: 'Apply coupon' });
    public alertMessage = () => this.page.getByRole('alert');
    public cartTotalElement = () => this.page.locator('.cart_totals');
    private removeDiscountButton = () => this.page.getByRole('link', {name: '[Remove]'});
    private removeItemButton = () => this.page.locator(".remove");
    public cartEmptyDialog = () => this.page.getByText('Your cart is currently empty.');
    private checkoutLink = () => this.page.getByRole('link', { name: 'Proceed to checkout' })

    private subtotalPrice = () => this.page.locator("[class='cart-subtotal'] bdi");
    private shippingPrice = () => this.page.locator("Label > span > bdi");
    private grandTotalPrice = () => this.page.locator(".order-total > td");
    private couponDiscount = (couponCode : string) => this.page.locator(`[data-title='Coupon: ${couponCode}'] .amount`);

    /* Clears and sets the value coupon from argument value. */
    async enterCoupon(coupon: string) {
        await this.couponCodeField().fill(coupon);
    }

    /* Clicks apply coupon button. */
    async applyCoupon() {
        await this.applyCouponButton().click();
    }

    /* Gets the subtotal price from the cart page. */
    async getSubtotalPrice(): Promise<number>{
        const subtotal = await this.subtotalPrice().textContent();
        return Number(subtotal?.replace("£", ""));
    }

    /* Gets the shipping price from the cart page. */
    async getShippingPrice(): Promise<number> {
        const shipping = await this.shippingPrice().textContent();
        return Number(shipping?.replace("£", ""));
    }

    /* Gets the grand total price from the cart page. */
    async getGrandTotalPrice(): Promise<number> {
        const grandTotal = await this.grandTotalPrice().textContent();
        return Number(grandTotal?.replace("£", ""));
    }

    /* Gets the coupon discount from the cart page. */
    async getCouponDiscount(couponCode: string): Promise<number> {
        const couponDiscount = await this.couponDiscount(couponCode).textContent();
        return Number(couponDiscount?.replace("£", ""));
    }

    /* Gets the coupon discount percentage. */
    async getDiscountPercentage(couponCode: string): Promise<number> {
        const discountPercentage = await this.getCouponDiscount(couponCode) / await this.getSubtotalPrice() * 100;
        console.log(`Applied a ${discountPercentage}% discount`)

        return Number(discountPercentage.toFixed(2));
    }

    /* Validates that the calculated total matches the grand total price. */
    async calculateTotal(couponCode: string): Promise<number> {
        let checkTotal = await this.getSubtotalPrice() - await this.getCouponDiscount(couponCode) + await this.getShippingPrice();

        return Number(checkTotal.toFixed(2));
    }

    /* Checks if added items are in the actual cart */
    async checkItemInCart(addedItems: string[]) {
        await this.cartContent().waitFor();

        const texts = await this.cartItems().allTextContents();
        const trimmedTexts = texts.map((text) => text.trim());

        expect(trimmedTexts).toEqual(expect.arrayContaining(addedItems));
        console.log(`Verified that the '${addedItems}' are in the cart`);
    }

    /* Navigates to the checkout page. */
    async goToCheckout() {
        await this.checkoutLink().click();

        return new CheckoutPOM(this.page);
    }

    /* Removes all coupon discounts added to cart */
    async removeDiscounts() {
        const removeLink = await this.removeDiscountButton().all();

        for (let i = 0; i < removeLink.length; i++) {
            await this.removeDiscountButton().first().click();
            const block = this.page.locator('.blockUI.blockOverlay');
            await block.first().waitFor({state: "hidden"});
        }
    }

    /* Removes all items added to cart */
    async emptyCart() {
        await this.cartContent().waitFor();
        await this.removeDiscounts();

        while(await this.removeItemButton().first().isVisible()) {
            await this.removeItemButton().first().click();
            const block = this.page.locator('.blockUI.blockOverlay');
            await block.first().waitFor({state: "hidden"});
        }
    }
}

export default CartPOM;
