import { test, expect } from "./Utils/AddItemLogoutFixture";
import Customer from "./Utils/Customer";
import billingDetails from "./JSONData/BillingDetails.json"
import couponData from "./JSONData/CouponCodes.json"


test.describe("eCommerce Tests", () => {

  couponData.forEach(coupon => {
      test(`Applying Coupon - '${coupon.code}' `, async ({ page, addItemLogoutFix, cartPOM }, testInfo) => {
        // Validates the entered coupon
        await (await cartPOM.EnterCoupon(coupon.code)).ApplyCoupon();
        await expect(cartPOM.alertMessage(), `Coupon Code '${coupon.code}, does not exist!`).not.toContainText("does not exist!");
        console.log(`Valid Coupon Applied: '${coupon.code}'`);

        const expectedDiscount = coupon.discount; // Expected Discount of 25% for nfocus. 15% for edgewords
        const actualDiscount = await cartPOM.GetDiscountPercentage(coupon.code); // Calculates actual discount
        await expect(actualDiscount, `Expected ${expectedDiscount}% off, Actual ${actualDiscount}% off instead`).toBe(expectedDiscount);

        const calculatedTotal = await cartPOM.CalculateTotal(coupon.code);
        const grandTotalPrice = await cartPOM.GetGrandTotalPrice();

        // Validates that the discount has been applied correctly with the total price
        await expect(grandTotalPrice, "Discount not applied correctly!").toBe(calculatedTotal);
        console.log(`Expected total value: £${grandTotalPrice}, Actual total value: £${calculatedTotal}`);

        // Wait for js scripts on page to finish before screenshotting element
        await page.waitForLoadState("networkidle");
        let date = new Date().toLocaleString();
        date = date.split("/").join("-").split(":").join("-");

        await cartPOM.cartTotalElement().screenshot({ path: `./Screenshots/Cart Total, ${date}.png` })
        console.log("Attaching 'Cart Total' screenshot to report")
        await testInfo.attach('Cart Total', { path: `./Screenshots/Cart Total, ${date}.png` })
    });
  });

  test("Checkout Process", async ({ page, addItemLogoutFix, cartPOM, checkoutPOM, orderInfoPOM, navPOM, accountPOM, allOrdersPOM }, testInfo) => {
    // Navigate to Checkout
    await cartPOM.GoToCheckout();

    // Create customer object to use to populate billing fields
    const customerInfo = new Customer(billingDetails.fName,
                                      billingDetails.lName,
                                      billingDetails.address,
                                      billingDetails.city,
                                      billingDetails.postcode,
                                      billingDetails.phone,
                                      billingDetails.email);

    // Fill in Billing Input Fields with customer object
    await checkoutPOM.FillInBillingDetails(customerInfo);
    // Validate billing fields have been entered with customer details
    const mismatch = checkoutPOM.ValidateDetails(customerInfo);

    await expect(mismatch, `Billing input fields mismatch.`).resolves.toBe('');
    console.log("Validated Billing Details have been populated correctly.");

    // Selects payment and places the order
    const paymentMethod: string = "Cheque";
    await (await checkoutPOM.SelectPayment(paymentMethod)).PlaceOrder();

    // Take screenshot of the new Order
    await page.waitForURL(/order-received/); // wait until page navigates
    let date = new Date().toLocaleString();
    date = date.split("/").join("-").split(":").join("-");

    await page.screenshot({ path: `./Screenshots/New Order, ${date}.png`, fullPage: true });
    console.log("Attaching 'New Order' screenshot to report");
    await testInfo.attach('New Order', { path: `./Screenshots/New Order, ${date}.png` });

    // Captures the new order number
    const newOrderNum = await orderInfoPOM.GetOrderNumber();

    // Navigate to all orders page from account
    await navPOM.GoToAccount();
    await accountPOM.GoToOrders();

    // Capture order number on All Orders Page
    const orderNumCheck = await allOrdersPOM.GetLatestOrder();

    await expect(orderNumCheck, `Order numbers do not match! ${orderNumCheck} with ${newOrderNum}`).toEqual(newOrderNum);
    console.log("Verified that the order numbers match from checkout page..");
    console.log(`Expected order number: ${orderNumCheck}, Actual order number: ${newOrderNum}`);

    // Takes screenshot of all orders table, highlighted the latest with the datetime
    date = new Date().toLocaleString();
    date = date.split("/").join("-").split(":").join("-");

    await allOrdersPOM.orderTable().screenshot({
      path: `./Screenshots/All Orders, ${date}.png`,
      mask: [page.locator('tbody tr').nth(0)],
      maskColor: 'rgba(201, 242, 155, 0.5)',
    });

    console.log("Attaching 'All Orders' screenshot to report");
    await testInfo.attach('All Orders', { path: `./Screenshots/All Orders, ${date}.png` })
  })
});
