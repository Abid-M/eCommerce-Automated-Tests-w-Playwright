import { test, expect } from "./Utils/Fixtures";
import couponData from "./Data/CouponCodes.json"

couponData.forEach(coupon => {
    test(`Applying Coupon - '${coupon.code}' `, async ({ page, cartAndClearup, customer}, testInfo) => {
      // Validates the entered coupon
      await (await cartAndClearup.EnterCoupon(coupon.code)).ApplyCoupon();
      await expect(cartAndClearup.alertMessage(), `Expected Coupon Code '${coupon.code}' to be valid`).not.toContainText("does not exist!");
      console.log(`Valid Coupon Applied: '${coupon.code}'`);

      const expectedDiscount = coupon.discount; // Expected Discount of 25% for nfocus. 15% for edgewords
      const actualDiscount = await cartAndClearup.GetDiscountPercentage(coupon.code); // Calculates actual discount
      expect(actualDiscount, `Expected ${expectedDiscount}% off, Actual ${actualDiscount}% off`).toBe(expectedDiscount);

      const calculatedTotal = await cartAndClearup.CalculateTotal(coupon.code);
      const grandTotalPrice = await cartAndClearup.GetGrandTotalPrice();

      // Validates that the discount has been applied correctly with the total price
      expect(grandTotalPrice, "Discount not applied correctly!").toBe(calculatedTotal);
      console.log(`Expected total value: £${grandTotalPrice}, Actual total value: £${calculatedTotal}`);

      // Screenshot
      let date = new Date().toLocaleString();
      date = date.split("/").join("-").split(":").join("-");

      await cartAndClearup.cartTotalElement().screenshot({ path: `./Screenshots/Cart Total, ${date}.png` })
      console.log("Attaching 'Cart Total' screenshot to report")
      await testInfo.attach('Cart Total', { path: `./Screenshots/Cart Total, ${date}.png` })
  });
});