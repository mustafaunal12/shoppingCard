const { required } = require('./common');

/**
 * Returns CalculateDeliveryCostFunction
 * @param {number} costPerDelivery - Cost Per Delivery
 * @param {number} costPerProduct - Cost Per Product
 * @param {number} fixedCost - Fixed Cost
 * @returns {CalculateDeliveryCostFunction} - Returns total delivery cost 
 */
const calculateDeliveryCost = (costPerDelivery, costPerProduct, fixedCost) =>
	/**
	 * Calculates delivery cost for shopping cart
	 * @callback CalculateDeliveryCostFunction
	 * @param {[CartItems]} cart - cart
	 * @returns {number} - Returns total delivery cost 
	 */
	function (cart) {
		required('cart')(...arguments);

		if (cart.length === 0) {
			return 0;
		}

		const categories = new Set(cart.map(cartItem => cartItem.product.category));
		const deliveryCost = categories.size * costPerDelivery;

		const productCost = cart.length * costPerProduct;

		return deliveryCost + productCost + fixedCost;
	};

module.exports = {
	calculateDeliveryCost
};