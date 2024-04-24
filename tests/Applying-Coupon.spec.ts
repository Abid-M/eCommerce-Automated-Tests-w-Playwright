import { test, expect } from "./Utils/Fixtures";
import couponData from "./Data/CouponCodes.json"

couponData.forEach(coupon => {
    test(`Applying Coupon - '${coupon.code}' `, async ({ filledCartAndClearup }, testInfo) => {
      // Validates the entered coupon
      await filledCartAndClearup.enterCoupon(coupon.code)
      await filledCartAndClearup.applyCoupon();
      await expect(filledCartAndClearup.alertMessage(), `Expected Coupon Code '${coupon.code}' to be valid`).not.toContainText("does not exist!");

      const expectedDiscount = coupon.discount; // Expected Discount of 25% for nfocus. 15% for edgewords
      const actualDiscount = await filledCartAndClearup.getDiscountPercentage(coupon.code); // Calculates actual discount
      expect(actualDiscount, `Expected ${expectedDiscount}% off, Actual ${actualDiscount}% off`).toBe(expectedDiscount);

      const calculatedTotal = await filledCartAndClearup.calculateTotal(coupon.code);
      const grandTotalPrice = await filledCartAndClearup.getGrandTotalPrice();

      // Validates that the discount has been applied correctly with the total price
      expect(grandTotalPrice, `Expected total value: £${grandTotalPrice}, Actual total value: £${calculatedTotal}`).toBe(calculatedTotal);

      // Screenshot
      let date = new Date().toLocaleString();
      date = date.split("/").join("-").split(":").join("-");

      await filledCartAndClearup.cartTotalElement().screenshot({ path: `./Screenshots/Cart Total, ${date}.png` })
      console.log("Attaching 'Cart Total' screenshot to report")
      await testInfo.attach('Cart Total', { path: `./Screenshots/Cart Total, ${date}.png` })
  });
});


