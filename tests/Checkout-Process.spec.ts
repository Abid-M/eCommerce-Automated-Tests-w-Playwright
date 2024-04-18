import { test, expect } from "./Utils/Fixtures";
import Customer from "./Utils/Customer";
import billingDetails from "./JSONData/BillingDetails.json"
import { AllOrdersPOM, CheckoutPOM, OrderInfoPOM } from "./POMPages";

test("Checkout Process", async ({ page, addItemLogoutFix, cartPOM, navPOM }, testInfo) => {
    // Navigate to Checkout
    const checkout: CheckoutPOM = await cartPOM.GoToCheckout();

    // Create customer object to use to populate billing fields
    const customerInfo = new Customer(billingDetails.fName,
                                      billingDetails.lName,
                                      billingDetails.address,
                                      billingDetails.city,
                                      billingDetails.postcode,
                                      billingDetails.phone,
                                      billingDetails.email);

    // Fill in Billing Input Fields with customer object
    await checkout.FillInBillingDetails(customerInfo);
    // Validate billing fields have been entered with customer details
    const mismatch = checkout.ValidateDetails(customerInfo);

    await expect(mismatch, `Billing input fields mismatch.`).resolves.toBe('');
    console.log("Validated Billing Details have been populated correctly.");

    // Selects payment and places the order
    const paymentMethod: string = "Cheque";
    const orderRecieved : OrderInfoPOM = await (await checkout.SelectPayment(paymentMethod)).PlaceOrder();

    // Take screenshot of the new Order
    await page.waitForURL(/order-received/); // wait until page navigates
    let date = new Date().toLocaleString();
    date = date.split("/").join("-").split(":").join("-");

    await page.screenshot({ path: `./Screenshots/New Order, ${date}.png`, fullPage: true });
    console.log("Attaching 'New Order' screenshot to report");
    await testInfo.attach('New Order', { path: `./Screenshots/New Order, ${date}.png` });

    // Captures the new order number
    const newOrderNum = await orderRecieved.GetOrderNumber();

    // Navigate to all orders page from account
    const allOrders : AllOrdersPOM = await (await navPOM.GoToAccount()).GoToOrders();

    // Capture order number on All Orders Page
    const orderNumCheck = await allOrders.GetLatestOrder();

    expect(orderNumCheck, `Order numbers do not match! ${orderNumCheck} with ${newOrderNum}`).toEqual(newOrderNum);
    console.log("Verified that the order numbers match from checkout page..");
    console.log(`Expected order number: ${orderNumCheck}, Actual order number: ${newOrderNum}`);

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