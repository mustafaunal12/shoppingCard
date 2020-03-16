const { required } = require('./common');

const campaignService = require('./campaign');
const couponService = require('./coupon');
const deliveryService = require('./delivery');

const groupByCategory = cart => {
	if (!cart.length) {
		return {};
	}

	const groups = cart.reduce((group, item) => {
		const productPrice = item.product.price * item.quantity;
		const category = item.product.category;

		group.categories = group.categories || [];
		group.categories[category] = (group.categories[category] || {});
		group.categories[category].products = (group.categories[category].products || []).concat({ ...item, amount: productPrice });

		group.categories[category].amount = (group.categories[category].amount || 0) + productPrice;
		group.categories[category].quantity = (group.categories[category].quantity || 0) + item.quantity;
		group.totalPrice = (group.totalPrice || 0) + productPrice;
		group.totalQuantity = (group.totalQuantity || 0) + item.quantity;

		return group;
	}, {});

	return groups;
};

const applyCampaingDiscount = (campaignsData, categoriesData) =>
	function (category, categoryItemCount, categoryTotalAmount) {
		const applicableCampaignsFinder = campaignService.findApplicableCampaigns(campaignsData, categoriesData);
		const applicableCampaigns = applicableCampaignsFinder(category, categoryItemCount);

		if (!applicableCampaigns || !applicableCampaigns.length) {
			return 0;
		}

		const maxCampaingDiscountFinder = campaignService.findMaxDiscount(applicableCampaigns);
		const maxDiscount = maxCampaingDiscountFinder(categoryTotalAmount);

		return maxDiscount;
	};

const applyCouponDiscount = (couponsData) =>
	function (cartAmount) {
		const applicableCouponFinder = couponService.findMaxDiscount(couponsData);
		return applicableCouponFinder(cartAmount);
	};

/**
 * Returns GetTotalAmountAfterDiscountsFunction
 * @param {[Campaign]} campaignsData - Data array of campaign
 * @param {[Category]} categoriesData - Data array of category
 * @param {[Coupon]} couponsData - Data array of coupon
 * @returns {GetTotalAmountAfterDiscountsFunction} - GetTotalAmountAfterDiscounts Function
 */
const getTotalAmountAfterDiscounts = (campaignsData, categoriesData, couponsData) =>
	/**
	 * Returns total cart amount after discounts
	 * @callback GetTotalAmountAfterDiscountsFunction
	 * @param {[CartItem]} cart - List of cart items
	 * @returns {number} - Returns amount
	 */
	function (cart) {
		required('cart')(cart);

		const campaignDiscount = getCampaignDiscount(campaignsData, categoriesData)(cart);

		const { totalAmount } = groupByCategory(cart);

		const cartAmountAfterCampaignDiscount = campaignDiscount ? totalAmount - campaignDiscount : totalAmount;

		const couponDiscount = applyCouponDiscount(couponsData)(cartAmountAfterCampaignDiscount);

		return couponDiscount ? cartAmountAfterCampaignDiscount - couponDiscount : cartAmountAfterCampaignDiscount;
	};

/**
 * Returns GetCouponDiscountFunction
 * @param {[Coupon]} couponsData - Data array of coupon
 * @returns {GetCouponDiscountFunction} - GetCouponDiscount Function
 */
const getCouponDiscount = couponsData =>
	/**
	 * Returns coupon discount
	 * @callback GetCouponDiscountFunction
	 * @param {[CartItem]} cart - List of cart items
	 * @returns {number} - Returns amount
	 */
	function (cart) {
		required('cart')(cart);

		const { totalPrice, totalQuantity } = groupByCategory(cart);

		if (totalQuantity === 0 || !totalPrice) {
			return 0;
		}

		const couponDiscountCalculator = applyCouponDiscount(couponsData);
		return couponDiscountCalculator(totalPrice);
	};

/**
 * Returns GetCampaignDiscountFunction
 * @param {[Campaign]} campaignsData - Data array of campaign
 * @param {[Category]} categoriesData - Data array of category
 * @returns {GetCampaignDiscountFunction} - GetCampaignDiscount Function
 */
const getCampaignDiscount = (campaignsData, categoriesData) =>
	/**
	 * Returns campaign discounts
	 * @callback GetCampaignDiscountFunction
	 * @param {[CartItem]} cart - List of cart items
	 * @returns {number} - Returns amount
	 */
	function (cart) {
		required('cart')(cart);

		const { totalQuantity, categories } = groupByCategory(cart);

		if (totalQuantity === 0) {
			return 0;
		}

		const campaignDiscountCalculator = applyCampaingDiscount(campaignsData, categoriesData);

		const discounts = Object.entries(categories)
			.map(c => {
				const category = c[0];
				const { quantity, amount } = c[1];

				return campaignDiscountCalculator(category, quantity, amount);
			});

		if (!discounts || !discounts.length) {
			return 0;
		}

		const campaignDiscount = discounts.reduce((prev, curr) => prev + curr);

		return campaignDiscount;
	};

/**
 * Returns GetDeliveryCost Function
 * @param {number} costPerDelivery - Cost per delivery
 * @param {number} costPerProduct - Cost per product
 * @param {number} fixedCost - Fixed cost
 * @returns {GetDeliveryCostFunction} - Returns calculated delivery cost
 */
const getDeliveryCost = (costPerDelivery, costPerProduct, fixedCost) =>
	/**
	 * Calculates delivery cost
	 * @callback GetDeliveryCostFunction
	 * @param {[CartItem]} cart - List of cart items
	 * @returns {number} - Returns calculated delivery cost
	 */
	function (cart) {
		required('cart')(cart);

		const delivaryCalculator = deliveryService.calculateDeliveryCost(cart);
		return delivaryCalculator(costPerDelivery, costPerProduct, fixedCost);
	};

/**
 * Returns PrintFunction
 * @param {[Campaign]} campaignsData - Data array of campaign
 * @param {[Category]} categoriesData - Data array of category
 * @param {[Coupon]} couponsData - Data array of coupon
 * @param {number} costPerDelivery - Cost per delivery
 * @param {number} costPerProduct - Cost per product
 * @param {number} fixedCost - Fixed cost
 * @returns {PrintFunction} - Print Function
 */
const print = (campaignsData, categoriesData, couponsData, costPerDelivery, costPerProduct, fixedCost) =>
	/**
	 * Prints cart details
	 * @callback PrintFunction
	 * @param {[CartItem]} cart - List of cart items
	 * @returns {object} - Contains category name, product name, quantity, unit price, total price before discount,
	 *  total price after discount,total discount, delivery cost
	 */
	function (cart) {
		const groups = groupByCategory(cart);

		const categories = Object.entries(groups.categories).map(([category, group]) => ({
			category: category,
			products: group.products.map(p => ({
				name: p.product.name,
				quantity: p.quantity,
				unitPrice: p.product.price,
				totalPrice: p.quantity * p.product.price
			}))
		}));

		const totalAmountAfterDiscounts = getTotalAmountAfterDiscounts(campaignsData, categoriesData, couponsData)(cart);

		const deliveryCost = getDeliveryCost(costPerDelivery, costPerProduct, fixedCost)(cart);

		return {
			categories,
			initialCartAmount: groups.totalPrice,
			deliveryCost,
			totalDiscount: groups.totalPrice - totalAmountAfterDiscounts,
			totalCartAmount: totalAmountAfterDiscounts + deliveryCost
		};
	};

module.exports = ({ campaignsData, categoriesData, couponsData, costPerDelivery, costPerProduct, fixedCost }) => ({
	getTotalAmountAfterDiscounts: getTotalAmountAfterDiscounts(campaignsData, categoriesData, couponsData),
	getCouponDiscount: getCouponDiscount(couponsData),
	getCampaignDiscount: getCampaignDiscount(campaignsData, categoriesData),
	getDeliveryCost: getDeliveryCost(costPerDelivery, costPerProduct, fixedCost),
	print: print(campaignsData, categoriesData, couponsData, costPerDelivery, costPerProduct, fixedCost)
});