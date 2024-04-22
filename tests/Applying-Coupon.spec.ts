import { test, expect } from "./Utils/Fixtures";
import couponData from "./Data/CouponCodes.json"

couponData.forEach(coupon => {
    test(`Applying Coupon - '${coupon.code}' `, async ({ fillCartAndClearup: cartAndClearup }, testInfo) => {
      // Validates the entered coupon
      await (await cartAndClearup.enterCoupon(coupon.code)).applyCoupon();
      await expect(cartAndClearup.alertMessage(), `Expected Coupon Code '${coupon.code}' to be valid`).not.toContainText("does not exist!");

      const expectedDiscount = coupon.discount; // Expected Discount of 25% for nfocus. 15% for edgewords
      const actualDiscount = await cartAndClearup.getDiscountPercentage(coupon.code); // Calculates actual discount
      expect(actualDiscount, `Expected ${expectedDiscount}% off, Actual ${actualDiscount}% off`).toBe(expectedDiscount);

      const calculatedTotal = await cartAndClearup.calculateTotal(coupon.code);
      const grandTotalPrice = await cartAndClearup.getGrandTotalPrice();

      // Validates that the discount has been applied correctly with the total price
      expect(grandTotalPrice, `Expected total value: £${grandTotalPrice}, Actual total value: £${calculatedTotal}`).toBe(calculatedTotal);

      // Screenshot
      let date = new Date().toLocaleString();
      date = date.split("/").join("-").split(":").join("-");

      await cartAndClearup.cartTotalElement().screenshot({ path: `./Screenshots/Cart Total, ${date}.png` })
      console.log("Attaching 'Cart Total' screenshot to report")
      await testInfo.attach('Cart Total', { path: `./Screenshots/Cart Total, ${date}.png` })
  });
});