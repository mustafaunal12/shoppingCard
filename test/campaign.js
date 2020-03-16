const assert = require('assert');

const campaignService = require('../services/campaign');
const { DiscountType } = require('../domains/enums');
const Category = require('../domains/category');
const Campaign = require('../domains/campaign');

describe('Campaign Service Tests', function () {
	describe('findApplicableCampaigns tests', function () {

		const shoesCategory = new Category('Shoes');
		const foodCategory = new Category('Food');
		const fruitCategory = new Category('Fruit', 'Food');
		const appleCategory = new Category('Apple', 'Fruit');
		const mobilePhoneCategory = new Category('MobilePhone');

		const campaigns = [
			new Campaign(shoesCategory.name, 30, 2, DiscountType.Amount),
			new Campaign(foodCategory.name, 50, 5, DiscountType.Rate),
			new Campaign(fruitCategory.name, 40, 4, DiscountType.Rate),
			new Campaign(appleCategory.name, 30, 3, DiscountType.Amount),
		];

		const categories = [shoesCategory, foodCategory, fruitCategory, appleCategory, mobilePhoneCategory];

		let campaignFinder;
		this.beforeAll(() => {
			campaignFinder = campaignService.findApplicableCampaigns(campaigns, categories);
		});

		it('Should return exception if category does not have a name', () => {
			try {
				campaignFinder('');

				assert.fail('Exception should be thrown');
			} catch (err) {
				assert.strictEqual(err.name, 'ArgumentRequiredError');
			}
		});
		it('Should return exception if quantity is undefined', () => {
			try {
				campaignFinder('Food', undefined);

				assert.fail('Exception should be thrown');
			} catch (err) {
				assert.strictEqual(err.name, 'ArgumentRequiredError');
			}
		});
		it('Should return 3 campaigns for an apple category product', () => {
			const campaigns = campaignFinder(appleCategory.name, 5);

			assert.strictEqual(campaigns.length, 3);
			assert.ok(campaigns.find(c => c.category === foodCategory.name));
			assert.ok(campaigns.find(c => c.category === fruitCategory.name));
			assert.ok(campaigns.find(c => c.category === appleCategory.name));
			assert.ok(!campaigns.find(c => c.category === shoesCategory.name));
		});
		it('Should return 2 campaigns for a fruit category product', () => {
			const campaigns = campaignFinder(fruitCategory.name, 5);

			assert.strictEqual(campaigns.length, 2);
			assert.ok(campaigns.find(c => c.category === foodCategory.name));
			assert.ok(campaigns.find(c => c.category === fruitCategory.name));
			assert.ok(!campaigns.find(c => c.category === appleCategory.name));
			assert.ok(!campaigns.find(c => c.category === shoesCategory.name));
		});
		it('Should return 1 campaign for a food category product', () => {
			const campaigns = campaignFinder(foodCategory.name, 5);

			assert.strictEqual(campaigns.length, 1);
			assert.ok(campaigns.find(c => c.category === foodCategory.name));
			assert.ok(!campaigns.find(c => c.category === fruitCategory.name));
			assert.ok(!campaigns.find(c => c.category === appleCategory.name));
			assert.ok(!campaigns.find(c => c.category === shoesCategory.name));
		});
		it('Should return 0 campaign for a mobile phone category product', () => {
			const campaigns = campaignFinder(mobilePhoneCategory, 4);

			assert.strictEqual(campaigns.length, 0);
		});
	});
	describe('findMaxDiscount Tests', function () {
		it('Should return exception if categoryAmount is undefined', () => {
			const campaigns = [
				new Campaign('Food', 50, 5, DiscountType.Rate),
				new Campaign('Food', 20, 3, DiscountType.Rate),
				new Campaign('Food', 50, 5, DiscountType.Amount)
			];
			try {
				const maxDiscountFinder = campaignService.findMaxDiscount(campaigns);
				maxDiscountFinder(undefined);

				assert.fail('Exception should be thrown');
			} catch (err) {
				assert.strictEqual(err.name, 'ArgumentRequiredError');
			}
		});
		it('Should return 100 for 5 product with 200 total price', () => {
			const campaigns = [
				new Campaign('Food', 50, 5, DiscountType.Rate),
				new Campaign('Food', 20, 3, DiscountType.Rate),
				new Campaign('Food', 5, 5, DiscountType.Amount)
			];

			const maxDiscountFinder = campaignService.findMaxDiscount(campaigns);
			const discount = maxDiscountFinder(200);

			assert.ok(discount);
			assert.strictEqual(discount, 100);
		});
		it('Should return 40 for 4 product with 200 total price', () => {
			const campaigns = [
				new Campaign('Food', 20, 3, DiscountType.Rate),
				new Campaign('Food', 5, 5, DiscountType.Amount)
			];

			const maxDiscountFinder = campaignService.findMaxDiscount(campaigns);
			const discount = maxDiscountFinder(200);

			assert.ok(discount);
			assert.strictEqual(discount, 40);
		});
		it('Should return 5 for 5 product with 9 total price', () => {
			const campaigns = [
				new Campaign('Food', 20, 3, DiscountType.Rate),
				new Campaign('Food', 5, 5, DiscountType.Amount)
			];

			const maxDiscountFinder = campaignService.findMaxDiscount(campaigns);
			const discount = maxDiscountFinder(9);

			assert.ok(discount);
			assert.strictEqual(discount, 5);
		});
	});
});