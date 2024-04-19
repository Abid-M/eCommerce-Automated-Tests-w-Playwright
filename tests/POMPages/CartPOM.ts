import { Page, expect } from "@playwright/test";
import CheckoutPOM from "./CheckoutPOM";

class CartPOM {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Locators
    cartItems = () => this.page.locator("td.product-name a"); //Collates all items in the cart (Tests for multiple items in cart)
    couponCodeField = () => this.page.getByPlaceholder('Coupon code');
    applyCouponButton = () => this.page.getByRole('button', { name: 'Apply coupon' });
    alertMessage = () => this.page.getByRole('alert');
    cartTotalElement = () => this.page.locator('.cart_totals');
    removeDiscountButton = () => this.page.getByRole('link', {name: '[Remove]'});
    removeItemButton = () => this.page.locator(".remove");
    cartEmptyDialog = () => this.page.getByText('Your cart is currently empty.');
    checkoutLink = () => this.page.getByRole('link', { name: 'Proceed to checkout' })

    subtotalPrice = () => this.page.locator("[class='cart-subtotal'] bdi");
    shippingPrice = () => this.page.locator("Label > span > bdi");
    grandTotalPrice = () => this.page.locator(".order-total > td");
    couponDiscount = (couponCode : string) => this.page.locator(`[data-title='Coupon: ${couponCode}'] .amount`);

    /* Clears and sets the value coupon from argument value. */
    async EnterCoupon(coupon: string) {
        await this.couponCodeField().fill(coupon);
        return this;
    }

    /* Clicks apply coupon button. */
    async ApplyCoupon() {
        await this.applyCouponButton().click();
    }

    /* Gets the subtotal price from the cart page. */
    async GetSubtotalPrice(): Promise<number>{
        const subtotal = await this.subtotalPrice().textContent();
        return Number(subtotal?.replace("£", ""));
    }

    /* Gets the shipping price from the cart page. */
    async GetShippingPrice(): Promise<number> {
        const shipping = await this.shippingPrice().textContent();
        return Number(shipping?.replace("£", ""));
    }

    /* Gets the grand total price from the cart page. */
    async GetGrandTotalPrice(): Promise<number> {
        const grandTotal = await this.grandTotalPrice().textContent();
        return Number(grandTotal?.replace("£", ""));
    }

    /* Gets the coupon discount from the cart page. */
    async GetCouponDiscount(couponCode: string): Promise<number> {
        const couponDiscount = await this.couponDiscount(couponCode).textContent();
        return Number(couponDiscount?.replace("£", ""));
    }

    /* Gets the coupon discount percentage. */
    async GetDiscountPercentage(couponCode: string): Promise<number> {
        const discountPercentage = await this.GetCouponDiscount(couponCode) / await this.GetSubtotalPrice() * 100;
        console.log(`Applied a ${discountPercentage}% discount`)

        return Number(discountPercentage.toFixed(2));
    }

    /* Validates that the calculated total matches the grand total price. */
    async CalculateTotal(couponCode: string): Promise<number> {
        let checkTotal = await this.GetSubtotalPrice() - await this.GetCouponDiscount(couponCode) + await this.GetShippingPrice();
        console.log(`Calculated total: £${checkTotal}`)

        return Number(checkTotal.toFixed(2));
    }

    /* Checks if added items are in the actual cart */
    async CheckItemInCart(addedItems : string[]) {
        const itemsInCart = await this.cartItems().all();
        const itemNamesPromises = itemsInCart.map(item => item.textContent());
        const itemNamesInCart = await Promise.all(itemNamesPromises);

        for (const item of addedItems) {
            expect(itemNamesInCart.includes(item)).toBeTruthy();
            console.log(`Verified that the '${item}' is in the cart`);
        }
    }

    /* Navigates to the checkout page. */
    async GoToCheckout() {
        await this.checkoutLink().click();
        console.log("Navigated to Checkout page")

        return new CheckoutPOM(this.page);
    }

    /* Removes all coupon discounts added to cart */
    async RemoveDiscounts(): Promise<CartPOM> {
        const removeLink = await this.removeDiscountButton().all();

        for (let i = 0; i < removeLink.length; i++) {
            await this.removeDiscountButton().first().click();
        }

        return this;
    }

    async EmptyCart() {
        await this.RemoveDiscounts();
        const removeItems = await this.removeItemButton().all();

        for (let i = 0; i < removeItems.length; i++) {
            await this.removeItemButton().first().click();
        }
    }
}

export default CartPOM;
