import { test, expect } from "./Utils/Fixtures";
import { AllOrdersPOM, CheckoutPOM, MyAccountPOM } from "./POMPages";

test("Checkout Process", async ({ page, cartAndClearup, navPOM, customer }, testInfo) => {
    // Navigate to Checkout
    const checkout: CheckoutPOM = await cartAndClearup.goToCheckout();

    // Fill in Billing Input Fields with customer object
    await checkout.fillInBillingDetails(customer);
    // Validate billing fields have been entered with customer details
    const mismatch = checkout.validateDetails(customer);

    await expect(mismatch, `Expected billing input fields to match`).resolves.toBe('');
    console.log("Validated Billing Details have been populated correctly");

    // Selects payment and places the order
    const paymentMethod = "Cheque"; //or Cash

    await checkout.selectPayment(paymentMethod);
    const orderRecieved = await checkout.placeOrder();

    // Take screenshot of the new Order
    await page.waitForURL(/order-received/); // wait until page navigates
    let date = new Date().toLocaleString();
    date = date.split("/").join("-").split(":").join("-");

    await page.screenshot({ path: `./Screenshots/New Order, ${date}.png`, fullPage: true });
    console.log("Attaching 'New Order' screenshot to report");
    await testInfo.attach('New Order', { path: `./Screenshots/New Order, ${date}.png` });

    // Captures the new order number
    const newOrderNum = await orderRecieved.getOrderNumber();

    // Navigate to all orders page from account
    const account: MyAccountPOM = await navPOM.goToAccount();
    const allOrders: AllOrdersPOM = await account.goToOrders();

    // Capture order number on All Orders Page
    const orderNumCheck = await allOrders.getLatestOrder();

    expect(orderNumCheck, `Expected order number: ${orderNumCheck}, Actual order number: ${newOrderNum}`).toEqual(newOrderNum);
    console.log("Verified that the order numbers match from checkout page..");

    // Takes screenshot of all orders table, highlighted the latest with the datetime
    date = new Date().toLocaleString();
    date = date.split("/").join("-").split(":").join("-");

    await allOrders.orderTable().screenshot({
      path: `./Screenshots/All Orders, ${date}.png`,
      mask: [page.locator('tbody tr').nth(0)],
      maskColor: 'rgba(201, 242, 155, 0.5)',
    });

    console.log("Attaching 'All Orders' screenshot to report");
    await testInfo.attach('All Orders', { path: `./Screenshots/All Orders, ${date}.png` })
  })