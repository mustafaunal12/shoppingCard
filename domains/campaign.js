/**
 * Returns new campaign object
 * @param {string} category - Category 
 * @param {number} discount - Discount
 * @param {number} minItemCount - Minimum item count
 * @param {number} discountType - Discount type { Rate: 1, Amount: 2 }
 * @returns {Campaign} - Campaign object
 */
function Campaign(category, discount, minItemCount, discountType) {
    return {
        category,
        discount,
        minItemCount,
        discountType
    };
};

module.exports = Campaign;