const assert = require('assert');

const couponService = require('../services/coupon');
const { DiscountType } = require('../domains/enums');
const Coupon = require('../domains/coupon');

describe('Coupon Service Tests', function () {
	describe('findMaxDiscount Test', function () {
		it('Should return exception if cartAmount is undefined', () => {
			try {
				const coupons = [
					new Coupon(100, 10, DiscountType.Rate),
					new Coupon(150, 5, DiscountType.Rate),
					new Coupon(100, 10, DiscountType.Amount),
				];
				const couponFinder = couponService.findMaxDiscount(coupons);
				couponFinder(undefined);

				assert.fail('Exception should be thrown');
			} catch (err) {
				assert.strictEqual(err.name, 'ArgumentRequiredError');
			}
		});
		it('Should return 0 if there is no matched coupon with total cart amount', () => {
			const coupons = [
				new Coupon(100, 10, DiscountType.Rate),
				new Coupon(150, 5, DiscountType.Rate),
				new Coupon(100, 10, DiscountType.Amount),
			];
			const couponFinder = couponService.findMaxDiscount(coupons);
			const discount = couponFinder(50);

			assert.strictEqual(discount, 0);
		});
		it('Should return 10 for single coupon for %10 discount with 100 cart amount', () => {
			const coupons = [
				new Coupon(100, 10, DiscountType.Rate)
			];
			const couponFinder = couponService.findMaxDiscount(coupons);
			const discount = couponFinder(100);

			assert.strictEqual(discount, 10);
		});
		it('Should return 10 for %10 discount qith 100 cart amount', () => {
			const coupons = [
				new Coupon(100, 10, DiscountType.Rate),
				new Coupon(150, 5, DiscountType.Rate),
				new Coupon(100, 10, DiscountType.Amount),
			];
			const couponFinder = couponService.findMaxDiscount(coupons);
			const discount = couponFinder(100);

			assert.ok(discount);
			assert.strictEqual(discount, 10);
		});
		it('Should return 10 for 10 amount discount with 100 cart amount', () => {
			const coupons = [
				new Coupon(100, 1, DiscountType.Rate),
				new Coupon(150, 5, DiscountType.Rate),
				new Coupon(100, 10, DiscountType.Amount),
			];
			const couponFinder = couponService.findMaxDiscount(coupons);
			const discount = couponFinder(100);

			assert.ok(discount);
			assert.strictEqual(discount, 10);
		});
	});
});
