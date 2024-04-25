import { expect } from "@playwright/test";
import CheckoutPOM from "./CheckoutPOM";
import BasePOM from "./BasePOM";

class CartPOM extends BasePOM {
    // Locators
    private cartItems = () => this.page.locator("td.product-name a");
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
        console.log(`Calculated total: £${checkTotal}`)

        return Number(checkTotal.toFixed(2));
    }

    /* Checks if added items are in the actual cart */
    async checkItemInCart(addedItems : string[]) {
        const itemsInCart = await this.cartItems().all();
        const itemNamesPromises = itemsInCart.map(item => item.textContent());
        const itemNamesInCart = await Promise.all(itemNamesPromises);

        for (const item of addedItems) {
            expect(itemNamesInCart.includes(item)).toBeTruthy();
            console.log(`Verified that the '${item}' is in the cart`);
        }
    }

    /* Navigates to the checkout page. */
    async goToCheckout() {
        await this.checkoutLink().click();
        console.log("Navigated to Checkout page")

        return new CheckoutPOM(this.page);
    }

    /* Removes all coupon discounts added to cart */
    async removeDiscounts() {
        const removeLink = await this.removeDiscountButton().all();

        for (let i = 0; i < removeLink.length; i++) {
            await this.removeDiscountButton().first().click();
        }
    }

    async emptyCart() {
        await this.removeDiscounts();
        const removeItems = await this.removeItemButton().all();

        for (let i = 0; i < removeItems.length; i++) {
            await this.removeItemButton().first().click();
        }
    }
}

export default CartPOM;
