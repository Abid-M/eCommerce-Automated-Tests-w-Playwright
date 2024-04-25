import { test as base, expect } from "@playwright/test";
import { LoginPOM, NavPOM, CartPOM, MyAccountPOM, ShopPOM } from "../POMPages";
import CustomerData from "../Data/CustomerInterface";
import * as fs from 'fs';

// Declaring types of fixtures ( for type arguments)
type fixtures = {
    loggedInAccountPage: MyAccountPOM;
    navPOM: NavPOM;

    filledCartAndClearup: CartPOM;
    customer: CustomerData;
}

type MyOptions = {
    defaultPaymentMethod: string;
};

export const test = base.extend<fixtures & MyOptions>({
    defaultPaymentMethod: ['Cash', { option: true }],

    loggedInAccountPage: async ({ page, navPOM }, use) => {
        // Navigates and validates eCommerce site
        await page.goto('');

        const account: MyAccountPOM = await navPOM.goToAccount();
        await expect(account.nFocusHeader()).toBeVisible();
        await navPOM.dismissBanner();

        // Retrieves sensitive email and password from .env file. If variable is null, throw error.
        const email: string = process.env.EMAIL ?? (() => { throw new Error("USERNAME env variable is not set"); })();
        const password: string = process.env.PASSWORD ?? (() => { throw new Error("PASSWORD env variable is not set"); })();

        // Validates login
        const login = new LoginPOM(page);
        console.log(email, password)
        await login.validLogin(email, password);
        await expect(login.logoutButton(), "Should be logged in").toBeVisible();

        await use(account);
    },

    filledCartAndClearup: async ({ page, navPOM, loggedInAccountPage }, use) => {
        // Navigate to Shop Page
        const shop: ShopPOM = await navPOM.goToShop();

        // Checks to see if products exists from json file 
        // Set Products in JSON 
        let itemsExists: Promise<string> = shop.checkItemsExists();
        await expect.soft(itemsExists).resolves.toBe("All Items from data file exists");

        const addedItems = await shop.addToCart();
        expect(addedItems, 'Items should have been added to Cart, Check Products JSON file').not.toHaveLength(0);

        // redirect to Cart Page
        const cart: CartPOM = await shop.goToCart();
        // Verifies items are actually in the cart
        cart.checkItemInCart(addedItems);

        await use(cart);

        // Teardown Clearup
        if (!page.url().includes("cart")) {
            await navPOM.goToCart();
        }

        // Removes all discounts and empties the cart
        await cart.emptyCart();
        // Verifies that the cart is empty  
        await expect(cart.cartEmptyDialog()).toBeVisible();
        console.log("Check Cart Cleared")

        // Navigate to Account Page and Logout
        await navPOM.goToAccount();
        await loggedInAccountPage.logout();

        // Verifies logged out if 'login' text on page
        await expect(loggedInAccountPage.loginText(), "Should be logged out").toBeVisible();
        console.log("Successfully Logged Out");

        await loggedInAccountPage.page.close();
    },

    customer: async ({ }, use) => {
        try {
            const rawData = fs.readFileSync('./tests/Data/CustomerDetails.json');
            const customerDetails = await JSON.parse(rawData.toString()) as CustomerData;
            await use(customerDetails);
        } catch (error) {
            console.error('An error occurred while parsing JSON or using customer details:', error);
        }
    },

    navPOM: async ({ page }, use) => {
        const nav = new NavPOM(page);
        await use(nav);
    },
})

export { expect } from '@playwright/test';
