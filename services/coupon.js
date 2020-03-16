const { required, convertToArray, getDiscount } = require('./common');

/**
 * Returns FindMaxDiscountFunction
 * @param {[Coupon]} coupons - Coupons data
 * @returns {FindMaxDiscountFunction} - FindMaxDiscount Function
 */
const findMaxDiscount = coupons =>
	/**
	 * Finds applicable coupon by total cart amount
	 * @callback FindMaxDiscountFunction
	 * @param {number} cartAmount - Total cart amount
	 * @returns {number} - Returns total discount
	 */
	function (cartAmount) {
		required('cartAmount')(cartAmount);

		const couponsData = convertToArray(coupons);

		const coupon = couponsData.filter(c => cartAmount >= c.minAmount);
		if (!coupon.length) {
			return 0;
		}

		const maxDiscount = coupon.map(c => {
			return getDiscount[c.discountType](c.discount, cartAmount);
		}).reduce((prev, curr) => Math.max(prev, curr));

		return maxDiscount;
	};

module.exports = {
	findMaxDiscount
};