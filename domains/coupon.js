/**
 * Returns new Coupon object
 * @param {number} minAmount - Minimum amount 
 * @param {number} discount - Discount
 * @param {number} discountType - Discount type { Rate: 1, Amount: 2 }
 * @returns {Coupon} - Coupon object
 */
function Coupon(minAmount, discount, discountType) {
    return {
        minAmount,
        discount,
        discountType
    };
};

module.exports = Coupon;