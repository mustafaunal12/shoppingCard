const { required, convertToArray, getDiscount } = require('./common');

/**
 * Returns FindApplicableCampaignsFunction
 * @param {[Campaign]} campaignsData - All active campaigns
 * @param {[Category]} categoriesData - All active categories
 * @returns {FindApplicableCampaignsFunction} - FindApplicableCampaignsFunction Function
 */
const findApplicableCampaigns = (campaignsData, categoriesData) =>
	/**
	 * Returns campaigns for category
	 * @callback FindApplicableCampaignsFunction
	 * @param {string} category - Category
	 * @param {number} quantity - Item quantity
	 * @returns {[Campaign]} - Returns all campaigns for given category and product quantity
	 */
	function (category, quantity) {
		required('category', 'quantity')(category, quantity);

		const categoryObj = categoriesData.find(c => c.name === category);
		if(!categoryObj) {
			return [];
		}

		const campaigns = convertToArray(campaignsData);

		const applicableCampaigns = campaigns.filter(c => c.category === category && c.minItemCount <= quantity);

		if (categoryObj.parent) {
			const parentCampaigns = findApplicableCampaigns(campaigns, categoriesData)(categoryObj.parent, quantity);
			return applicableCampaigns.concat(parentCampaigns);
		}

		return applicableCampaigns;
	};

/**
 * Returns FindMaximumDiscountFunction
 * @param {[Campaign]} campaigns - Available campaigns
 * @returns {FindMaximumDiscountFunction} - FindMaximumDiscount Function
 */
const findMaxDiscount = campaigns =>
	/**
	 * Finds maximum discount from campaign list
	 * @callback FindMaximumDiscountFunction
	 * @param {number} categoryAmount - Total category amount in cart
	 * @returns {number} - Returns discount amount
	 */
	function (categoryAmount) {
		required('categoryAmount')(categoryAmount);

		if (!Array.isArray(campaigns)) {
			return getDiscount[campaigns.discountType](campaigns.discount, categoryAmount);
		}

		const maxDiscount = campaigns.map(campaign => {
			return getDiscount[campaign.discountType](campaign.discount, categoryAmount);
		}).reduce((prev, curr) => Math.max(prev, curr));

		return maxDiscount;
	};

module.exports = {
	findApplicableCampaigns,
	findMaxDiscount
};