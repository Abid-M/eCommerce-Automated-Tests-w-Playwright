import { test, expect } from "./Utils/AddItemLogoutFixture";
import couponData from "./JSONData/CouponCodes.json"

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