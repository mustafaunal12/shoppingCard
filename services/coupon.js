const { required, convertToArray, getDiscount } = require('./common');

/**
 * Returns FindApplicableCouponFunction
 * @param {[Coupon]} coupons - Coupons data
 * @returns {FindApplicableCouponFunction} - FindApplicableCoupon Function
 */
const findApplicableCoupon = coupons =>
	/**
	 * Finds applicable coupon by total cart amount
	 * @callback FindApplicableCouponFunction
	 * @param {number} cartAmount - Total cart amount
	 * @returns {number} - Returns total discount
	 */
	function (cartAmount) {
		required('cartAmount')(cartAmount);

		const couponsData = convertToArray(coupons);

		const coupon = couponsData.find(c => c.minAmount >= cartAmount);
		if (!coupon) {
			return 0;
		}

		if (!Array.isArray(coupon)) {
			return getDiscount[coupon.discountType](coupon.discount, cartAmount);
		}

		const maxDiscount = coupon.map(c => {
			return getDiscount[c.discountType](c.discount, cartAmount);
		}).reduce((prev, curr) => Math.max(prev, curr));

		return maxDiscount;
	};

module.exports = {
	findApplicableCoupon
};