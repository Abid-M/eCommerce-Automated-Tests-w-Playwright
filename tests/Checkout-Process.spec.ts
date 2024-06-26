import { test, expect } from "./Utils/Fixtures";
import { AllOrdersPOM, CheckoutPOM, MyAccountPOM } from "./POMPages";

test("Checkout Process", async ({ page, filledCartAndClearup, navPOM, customer, defaultPaymentMethod  }, testInfo) => {
    // Navigate to Checkout
    const checkout: CheckoutPOM = await filledCartAndClearup.goToCheckout();

    // Fill in Billing Input Fields with customer object
    await checkout.fillInBillingDetails(customer);
    // Validate billing fields have been entered with customer details
    const mismatch = checkout.validateDetails(customer);

    await expect(mismatch, `Expected billing input fields to match`).resolves.toBe('');

    // Selects payment and places the order
    await checkout.selectPayment(defaultPaymentMethod);
    const orderRecieved = await checkout.placeOrder();

    // Take screenshot of the new Order
    await page.waitForURL(/order-received/); // wait until page navigates
    let date = new Date().toLocaleString();
    date = date.split("/").join("-").split(":").join("-");

    await page.screenshot({ path: `./Screenshots/New Order, ${date}.png`, fullPage: true });
    await testInfo.attach('New Order', { path: `./Screenshots/New Order, ${date}.png` });

    // Captures the new order number
    const newOrderNum = await orderRecieved.getOrderNumber();

    // Navigate to all orders page from account
    const account: MyAccountPOM = await navPOM.goToAccount();
    const allOrders: AllOrdersPOM = await account.goToOrders();

    // Capture order number on All Orders Page
    const orderNumCheck = await allOrders.getLatestOrder();
    expect(orderNumCheck, `Expected order number: ${orderNumCheck}, Actual order number: ${newOrderNum}`).toEqual(newOrderNum);
    console.log(`Expected order number: ${orderNumCheck}, Actual order number: ${newOrderNum}`);

    // Takes screenshot of all orders table, highlighted the latest with the datetime
    date = new Date().toLocaleString();
    date = date.split("/").join("-").split(":").join("-");

    await allOrders.orderTable().screenshot({path: `./Screenshots/All Orders, ${date}.png`});
    await testInfo.attach('All Orders', { path: `./Screenshots/All Orders, ${date}.png` })
  });

  