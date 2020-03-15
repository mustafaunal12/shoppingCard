/**
 * Returns new CartItem object
 * @param {Product} product - Product
 * @param {number} quantity - Quantity
 * @returns {CartItem} - CartItem object
 */
function CartItem(product, quantity) {
    return {
        product,
        quantity
    };
};

module.exports = CartItem;