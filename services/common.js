const { DiscountType } = require('../domains/enums');

const convertToArray = function (data) {
	return !data ? [] : (!Array.isArray(data) ? [data] : data);
};

const required = (...argumentName) => (...argumentArray) => {
	argumentName.forEach(function (name, index) {
		if (!argumentArray[index]) {
			const error = new Error(`Argument required : ${name}`);
			error.name = 'ArgumentRequiredError';
			throw error;
		}
	});
};

const getRateDiscount = (discount, amount) => (amount / 100) * discount;
const getAmountDiscount = discount => discount;

const getDiscount = {
	[DiscountType.Rate]: getRateDiscount,
	[DiscountType.Amount]: getAmountDiscount
};

module.exports = {
	convertToArray,
	required,
	getDiscount
};