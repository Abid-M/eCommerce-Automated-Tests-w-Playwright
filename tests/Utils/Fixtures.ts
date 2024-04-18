import {test as base, expect} from "@playwright/test";
import { LoginPOM, NavPOM, CartPOM, MyAccountPOM, ShopPOM } from "../POMPages";
import products from "../JSONData/Products.json"

// Declaring types of fixtures ( for type arguments)
type fixtures = {
    // Setup/Teardown
    addItemLogoutFix: any;
}

type pomFixtures = {
    // POM pages as fixtures
    loginPOM: LoginPOM;
    navPOM: NavPOM;
    cartPOM: CartPOM;
}

export const test = base.extend<fixtures & pomFixtures>({
    addItemLogoutFix: async({page, navPOM, loginPOM}, use) => {
        const addItemLogoutFix = undefined;
        
        // Navigates and validates eCommerce site
        await page.goto();
        //await expect(accountPOM.nFocusHeader()).toBeVisible();
        
        const account: MyAccountPOM = await navPOM.GoToAccount();
        await navPOM.DismissBanner();
    
        // Retrieves sensitive email and password from .env file. If variable is null, throw error.
        const email: string = process.env.EMAIL ?? (() => { throw new Error("USERNAME env variable is not set"); })();
        const password: string = process.env.PASSWORD ?? (() => { throw new Error("PASSWORD env variable is not set"); })();;
        
        // Validates login
        const loggedIn : boolean = await loginPOM.ValidLogin(email, password);
        expect(loggedIn, "Login Failed!").toBeTruthy();
        console.log("Succesfully Logged In")
    
        // Navigate to Shop Page
        const shop : ShopPOM = await navPOM.GoToShop();

        let addedItems : string [] = []
        for (const item of products) {
            // Checking if item exists before adding to cart
            if (item.AddToCart) {
                await expect(shop.addToCartButton(item.Product), `Item '${item.Product}' does not exist!`).toBeVisible();
                console.log(`'${item.Product}' exists on the shop page..`)
                
                // Add item to cart 
                await shop.AddToCart(item.Product);
                addedItems.push(item.Product);
                await page.waitForLoadState("networkidle");
            }
        };

        expect(addedItems, 'No items were added to the cart! Check Products JSON file').not.toHaveLength(0);
        
        // redirect to Cart Page
        await page.waitForLoadState("networkidle");
        const cart : CartPOM = await shop.GoToCart();

        // Verifies items are actually in the cart
        for (const item of addedItems) {
            await expect(cart.cartItems()).toHaveText(item);
            console.log(`Verified that the '${item}' is in the cart`)
        }

        await use(addItemLogoutFix);

        // Navigates to Cart page if not in current url
        if (!page.url().includes("cart")) {
          await navPOM.GoToCart();
        }
    
        // Removes all discounts and empties the cart
        await (await cart.RemoveDiscounts()).EmptyCart();  
        // Verifies that the cart is empty  
        await expect(cart.cartEmptyDialog()).toBeVisible({timeout: 10000});
        console.log("Check Cart Cleared")
    
        // Navigate to Account Page and Logout
        await page.waitForLoadState("networkidle");
        await (await navPOM.GoToAccount()).Logout();
    
        // Verifies logged out if 'login' text on page
        await expect(account.loginText(), "Logout Failed").toBeVisible();
        console.log("Successfully Logged Out")
        console.log("Test Passed & Completed!")
    },

    loginPOM: async({page}, use) => {
        const login = new LoginPOM(page);
        await use(login);
    },
    navPOM: async({page}, use) => {
        const nav = new NavPOM(page);
        await use(nav);
    },
    cartPOM: async({page}, use) => {
        const cart = new CartPOM(page);
        await use(cart);
    },
})

export { expect } from '@playwright/test';


  