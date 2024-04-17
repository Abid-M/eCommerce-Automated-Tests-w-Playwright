import {test as base, expect} from "@playwright/test";
import * as POMs from "../POMPages"
import products from "../JSONData/Products.json"

// Declaring types of fixtures ( for type arguments)
type fixtures = {
    // Setup/Teardown
    addItemLogoutFix: any;
}

type pomFixtures = {
    // POM pages as fixtures
    accountPOM: POMs.MyAccountPOM;
    loginPOM: POMs.LoginPOM;
    navPOM: POMs.NavPOM;
    shopPOM: POMs.ShopPOM;
    cartPOM: POMs.CartPOM;
    checkoutPOM: POMs.CheckoutPOM;
    orderInfoPOM: POMs.OrderInfoPOM;
    allOrdersPOM: POMs.AllOrdersPOM;
}

export const test = base.extend<fixtures & pomFixtures>({
    addItemLogoutFix: async({page, accountPOM, navPOM, loginPOM, shopPOM, cartPOM}, use) => {
        const addItemLogoutFix = undefined;
        
        // Navigates and validates eCommerce site
        await page.goto("my-account");
        await expect(accountPOM.nFocusHeader()).toBeVisible();
    
        await navPOM.DismissBanner();
    
        // Retrieves sensitive email and password from .env file. If variable is null, throw error.
        const email: string = process.env.EMAIL ?? (() => { throw new Error("USERNAME env variable is not set"); })();
        const password: string = process.env.PASSWORD ?? (() => { throw new Error("PASSWORD env variable is not set"); })();;
        
        // Validates login
        const loggedIn : boolean = await loginPOM.ValidLogin(email, password);
        await expect(loggedIn, "Login Failed!").toBeTruthy();
        console.log("Succesfully Logged In")
    
        // Navigate to Shop Page
        await navPOM.GoToShop();

        let hasAddedToCart = false;
        for (const item of products) {
            // Checking if item exists before adding to cart
            if (item.AddToCart) {
                await expect(shopPOM.addToCartButton(item.Product), `Item '${item.Product}' does not exist!`).toBeVisible();
                console.log(`'${item.Product}' exists on the shop page..`)
                
                // Add item to cart 
                await shopPOM.AddToCart(item.Product);
                await page.waitForLoadState("networkidle");
                hasAddedToCart = true;
            }
        };

        expect(hasAddedToCart, 'No items were added to the cart! Check Products JSON file').toBeTruthy();

        // redirect to Cart Page
        await page.waitForLoadState("networkidle");
        await shopPOM.GoToCart();
    
        await use(addItemLogoutFix);

        // Navigates to Cart page if not in current url
        if (await !page.url().includes("cart")) {
          await navPOM.GoToCart();
        }
    
        // Removes all discounts and empties the cart
        await (await cartPOM.RemoveDiscounts()).EmptyCart();  
        // Verifies that the cart is empty  
        await expect(cartPOM.cartEmptyDialog()).toBeVisible({timeout: 10000});
        console.log("Check Cart Cleared")
    
        // Navigate to Account Page and Logout
        await page.waitForLoadState("networkidle");
        await navPOM.GoToAccount();
        await accountPOM.Logout();
    
        // Verifies logged out if 'login' text on page
        await expect(page.getByText("Login"), "Logout Failed").toBeVisible();
        console.log("Successfully Logged Out")
        console.log("Test Passed & Completed!")
    },

    accountPOM: async({page}, use) => {
        const account = new POMs.MyAccountPOM(page);
        await use(account);
    },
    loginPOM: async({page}, use) => {
        const login = new POMs.LoginPOM(page);
        await use(login);
    },
    navPOM: async({page}, use) => {
        const nav = new POMs.NavPOM(page);
        await use(nav);
    },
    shopPOM: async({page}, use) => {
        const shop = new POMs.ShopPOM(page);
        await use(shop);
    },
    cartPOM: async({page}, use) => {
        const cart = new POMs.CartPOM(page);
        await use(cart);
    },
    checkoutPOM: async({page}, use) => {
        const checkout = new POMs.CheckoutPOM(page);
        await use(checkout);
    },
    orderInfoPOM: async({page}, use) => {
        const orderInfo = new POMs.OrderInfoPOM(page);
        await use(orderInfo);
    },
    allOrdersPOM: async({page}, use) => {
        const allOrders = new POMs.AllOrdersPOM(page);
        await use(allOrders);
    },
})

export { expect } from '@playwright/test';


  