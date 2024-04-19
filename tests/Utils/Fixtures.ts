import { test as base, expect } from "@playwright/test";
import { LoginPOM, NavPOM, CartPOM, MyAccountPOM, ShopPOM } from "../POMPages";

// Declaring types of fixtures ( for type arguments)
type fixtures = {
    loggedInAccountPage: MyAccountPOM;
    CartAndClearup: CartPOM;
}

type pomFixtures = {
    // POM pages as fixtures
    navPOM: NavPOM;
}

export const test = base.extend<fixtures & pomFixtures>({
    loggedInAccountPage: async ({ page, navPOM }, use) => {
        // Navigates and validates eCommerce site
        await page.goto('');

        const account: MyAccountPOM = await navPOM.GoToAccount();
        await expect(account.nFocusHeader()).toBeVisible();
        await navPOM.DismissBanner();

        // Retrieves sensitive email and password from .env file. If variable is null, throw error.
        const email: string = process.env.EMAIL ?? (() => { throw new Error("USERNAME env variable is not set"); })();
        const password: string = process.env.PASSWORD ?? (() => { throw new Error("PASSWORD env variable is not set"); })();

        // Validates login
        const login = new LoginPOM(page);
        expect(await login.ValidLogin(email, password), "Should be logged in").toBeTruthy();
        console.log("Succesfully Logged In")

        await use(account);
    },

    CartAndClearup: async ({ page, navPOM, loggedInAccountPage }, use) => {
        // Navigate to Shop Page
        const shop: ShopPOM = await navPOM.GoToShop();

        // Checks to see if products exists from json file 
        // Set Products in JSON 
        let itemsExists: Promise<string> = shop.checkItemsExists();
        console.log(itemsExists);
        await expect.soft(itemsExists).resolves.toBe("All Items from data file exists");

        const addedItems = await shop.AddToCart();
        expect(addedItems, 'Items should have been added to Cart, Check Products JSON file').not.toHaveLength(0);

        // redirect to Cart Page
        const cart: CartPOM = await shop.GoToCart();
        // Verifies items are actually in the cart
        cart.CheckItemInCart(addedItems);

        await use(cart);

        // Teardown Clearup
        if (!page.url().includes("cart")) {
          await navPOM.GoToCart();
        }

        // Removes all discounts and empties the cart
        await cart.EmptyCart();
        // Verifies that the cart is empty  
        await expect(cart.cartEmptyDialog()).toBeVisible();
        console.log("Check Cart Cleared")

        // Navigate to Account Page and Logout
        await navPOM.GoToAccount();
        await loggedInAccountPage.Logout();

        // Verifies logged out if 'login' text on page
        await expect(loggedInAccountPage.loginText(), "Should be logged out").toBeVisible();
        console.log("Successfully Logged Out")

        await loggedInAccountPage.page.close();
    },

    navPOM: async ({ page }, use) => {
        const nav = new NavPOM(page);
        await use(nav);
    },
})

export { expect } from '@playwright/test';
