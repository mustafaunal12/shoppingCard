/**
 * Returns new product object
 * @param {string} title - Product title
 * @param {string} category - Product category
 * @param {number} price - Product price
 * @returns {Product} - Product object
 */
function Product(title, category, price) {
	return {
		title,
		category,
		price
	};
}

module.exports = Product;