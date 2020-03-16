const assert = require('assert');

const CartItem = require('../domains/cartItem');
const Product = require('../domains/product');
const Campaign = require('../domains/campaign');
const Coupon = require('../domains/coupon');
const Category = require('../domains/category');

const { DiscountType } = require('../domains/enums');

const cartService = require('../services/cart');

describe('Cart Service Tests', function () {
	describe('getCouponDiscount Tests', function () {
		it('Should return exception if cart is undefined', () => {
			try {
				const couponsData = [
					new Coupon(100, 10, DiscountType.Rate),
					new Coupon(150, 5, DiscountType.Rate),
					new Coupon(100, 10, DiscountType.Amount),
				];
				cartService({ couponsData }).getCouponDiscount(undefined);

				assert.fail('Exception should be thrown');
			} catch (err) {
				assert.strictEqual(err.name, 'ArgumentRequiredError');
			}
		});
		it('Should return 0 if total cart amount is 0', () => {
			const couponsData = [
				new Coupon(100, 10, DiscountType.Rate),
				new Coupon(150, 5, DiscountType.Rate),
				new Coupon(100, 10, DiscountType.Amount),
			];

			const apple = new Product('Green Apple', 'Apple', 0);

			const cart = [
				new CartItem(apple, 10)
			];

			const discount = cartService({ couponsData }).getCouponDiscount(cart);

			assert.strictEqual(discount, 0);
		});
		it('Should return 0 if there is no matched coupon with total cart amount', () => {
			const couponsData = [
				new Coupon(100, 10, DiscountType.Rate),
				new Coupon(150, 5, DiscountType.Rate),
				new Coupon(100, 10, DiscountType.Amount),
			];

			const apple = new Product('Green Apple', 'Apple', 10);

			const cart = [
				new CartItem(apple, 5)
			];

			const discount = cartService({ couponsData }).getCouponDiscount(cart);

			assert.strictEqual(discount, 0);
		});
		it('Should return 10 for single coupon for %10 discount with 100 cart amount', () => {
			const couponsData = [
				new Coupon(100, 10, DiscountType.Rate)
			];

			const apple = new Product('Green Apple', 'Apple', 10);

			const cart = [
				new CartItem(apple, 10)
			];

			const discount = cartService({ couponsData }).getCouponDiscount(cart);

			assert.strictEqual(discount, 10);
		});
		it('Should return 10 for %10 discount qith 100 cart amount', () => {
			const couponsData = [
				new Coupon(100, 10, DiscountType.Rate),
				new Coupon(150, 5, DiscountType.Rate),
				new Coupon(100, 10, DiscountType.Amount),
			];

			const apple = new Product('Green Apple', 'Apple', 10);

			const cart = [
				new CartItem(apple, 10)
			];

			const discount = cartService({ couponsData }).getCouponDiscount(cart);

			assert.ok(discount);
			assert.strictEqual(discount, 10);
		});
		it('Should return 10 for 10 amount discount with 100 cart amount', () => {
			const couponsData = [
				new Coupon(100, 1, DiscountType.Rate),
				new Coupon(150, 5, DiscountType.Rate),
				new Coupon(100, 10, DiscountType.Amount),
			];

			const apple = new Product('Green Apple', 'Apple', 10);

			const cart = [
				new CartItem(apple, 10)
			];

			const discount = cartService({ couponsData }).getCouponDiscount(cart);

			assert.ok(discount);
			assert.strictEqual(discount, 10);
		});
	});
	describe('getCampaignDiscount Tests', function () {
		const campaignsData = [
			new Campaign('Shoes', 30, 2, DiscountType.Amount),
			new Campaign('Food', 50, 5, DiscountType.Rate),
			new Campaign('Fruit', 40, 4, DiscountType.Rate),
			new Campaign('Apple', 30, 3, DiscountType.Amount),
		];
		const categoriesData = [
			new Category('Apple', 'Fruit'),
			new Category('Fruit', 'Food'),
			new Category('Food'),
			new Category('Adidas', 'Shoes'),
			new Category('Shoes')
		];

		it('Should return exception if cart is undefined', () => {
			try {
				cartService({ campaignsData, categoriesData }).getCampaignDiscount(undefined);

				assert.fail('Exception should be thrown');
			} catch (err) {
				assert.strictEqual(err.name, 'ArgumentRequiredError');
			}
		});
		it('Should return 0 for 5 product from Computer category with 200 total price', () => {
			const dell = new Product('Dell', 'Computer', 50);
			const macbook = new Product('MacBook', 'Computer', 50);

			const cart = [
				new CartItem(dell, 2),
				new CartItem(macbook, 2)
			];

			const discount = cartService({ campaignsData, categoriesData }).getCampaignDiscount(cart);

			assert.strictEqual(discount, 0);
		});
		it('Should return 100 for 5 product from Food category with 200 total price', () => {
			const apple = new Product('Green Apple', 'Food', 40);

			const cart = [
				new CartItem(apple, 5)
			];

			const discount = cartService({ campaignsData, categoriesData }).getCampaignDiscount(cart);

			assert.ok(discount);
			assert.strictEqual(discount, 100);
		});
		it('Should return 0 for 1 product from Food category with 40 total price', () => {
			const apple = new Product('Green Apple', 'Food', 40);

			const cart = [
				new CartItem(apple, 1)
			];

			const discount = cartService({ campaignsData, categoriesData }).getCampaignDiscount(cart);

			assert.strictEqual(discount, 0);
		});
		it('Should return 40 for 4 product from Fruit category with 100 total price', () => {
			const apple = new Product('Green Apple', 'Fruit', 25);

			const cart = [
				new CartItem(apple, 4)
			];

			const discount = cartService({ campaignsData, categoriesData }).getCampaignDiscount(cart);

			assert.ok(discount);
			assert.strictEqual(discount, 40);
		});
		it('Should return 4.5 for 5 product from Fruit category with 9 total price', () => {
			const greenApple = new Product('Green Apple', 'Fruit', 1);
			const redApple = new Product('Red Apple', 'Fruit', 5);

			const cart = [
				new CartItem(greenApple, 4),
				new CartItem(redApple, 1)
			];

			const discount = cartService({ campaignsData, categoriesData }).getCampaignDiscount(cart);

			assert.ok(discount);
			assert.strictEqual(discount, 4.5);
		});
	});
	describe('getTotalAmountAfterDiscounts Tests', function () {
		const campaignsData = [
			new Campaign('Shoes', 30, 2, DiscountType.Amount),
			new Campaign('Food', 50, 5, DiscountType.Rate),
			new Campaign('Fruit', 40, 4, DiscountType.Rate),
			new Campaign('Apple', 30, 3, DiscountType.Amount),
		];
		const categoriesData = [
			new Category('Apple', 'Fruit'),
			new Category('Fruit', 'Food'),
			new Category('Food'),
			new Category('Adidas', 'Shoes'),
			new Category('Shoes')
		];
		const couponsData = [
			new Coupon(100, 1, DiscountType.Rate),
			new Coupon(150, 5, DiscountType.Rate),
			new Coupon(100, 10, DiscountType.Amount),
		];

		it('Should return exception if cart is undefined', () => {
			try {
				cartService({ campaignsData, categoriesData, couponsData }).getTotalAmountAfterDiscounts(undefined);

				assert.fail('Exception should be thrown');
			} catch (err) {
				assert.strictEqual(err.name, 'ArgumentRequiredError');
			}
		});
		it('Should return 2 for a card with 2 total amount if there is any applicable campaigns or coupons', () => {
			const greenApple = new Product('Green Apple', 'Fruit', 1);
			const redApple = new Product('Red Apple', 'Fruit', 1);

			const cart = [
				new CartItem(greenApple, 1),
				new CartItem(redApple, 1)
			];

			const amount = cartService({ campaignsData, categoriesData, couponsData }).getTotalAmountAfterDiscounts(cart);

			assert.ok(amount);
			assert.strictEqual(amount, 2);
		});
		it('Should return 50 for a card with 5 products 100 total amount, apply %50 campaign ', () => {
			const greenApple = new Product('Green Apple', 'Fruit', 20);
			const redApple = new Product('Red Apple', 'Fruit', 10);

			const cart = [
				new CartItem(greenApple, 3),
				new CartItem(redApple, 4)
			];

			const amount = cartService({ campaignsData, categoriesData, couponsData }).getTotalAmountAfterDiscounts(cart);

			assert.ok(amount);
			assert.strictEqual(amount, 50);
		});
		it('Should return 90 for a card with 1 product 100 total amount, apply %10 coupon', () => {
			const greenApple = new Product('Green Apple', 'Fruit', 100);

			const cart = [
				new CartItem(greenApple, 1),
			];

			const amount = cartService({ campaignsData, categoriesData, couponsData }).getTotalAmountAfterDiscounts(cart);

			assert.ok(amount);
			assert.strictEqual(amount, 90);
		});
		it('Should return 90 for a card with 5 product 200 total amount, apply %50 campaign and %10 coupon', () => {
			const greenApple = new Product('Green Apple', 'Fruit', 25);
			const redApple = new Product('Red Apple', 'Fruit', 50);

			const cart = [
				new CartItem(greenApple, 2),
				new CartItem(redApple, 3)
			];

			const amount = cartService({ campaignsData, categoriesData, couponsData }).getTotalAmountAfterDiscounts(cart);

			assert.ok(amount);
			assert.strictEqual(amount, 90);
		});
	});
	describe('getDeliveryCost Tests', function () {

		const costPerDelivery = 2.5;
		const costPerProduct = 1.5;
		const fixedCost = 2.99;

		it('Should return exception if cart is undefined', () => {
			try {
				cartService({ costPerDelivery, costPerProduct, fixedCost }).getDeliveryCost(undefined);

				assert.fail('Exception should be thrown');
			} catch (err) {
				assert.strictEqual(err.name, 'ArgumentRequiredError');
			}
		});
		it('Should return 0 if cart contains any item', () => {
			const cost = cartService({ costPerDelivery, costPerProduct, fixedCost }).getDeliveryCost([]);

			assert.strictEqual(cost, 0);
		});
		it('Should return 6.99 if cart contains single item', () => {
			const greenApple = new Product('Green Apple', 'Fruit', 25);

			const cart = [
				new CartItem(greenApple, 1),
			];

			const cost = cartService({ costPerDelivery, costPerProduct, fixedCost }).getDeliveryCost(cart);

			assert.strictEqual(cost, 6.99);
		});
		it('Should return 8.49 if cart contains 2 item in same category', () => {
			const greenApple = new Product('Green Apple', 'Fruit', 25);
			const redApple = new Product('Red Apple', 'Fruit', 50);

			const cart = [
				new CartItem(greenApple, 1),
				new CartItem(redApple, 1)
			];

			const cost = cartService({ costPerDelivery, costPerProduct, fixedCost }).getDeliveryCost(cart);

			assert.strictEqual(cost, 8.49);
		});
		it('Should return 10.99 if cart contains 2 item in 2 different categories', () => {
			const greenApple = new Product('Green Apple', 'Fruit', 25);
			const dell = new Product('Dell Notebook', 'Computer', 50);

			const cart = [
				new CartItem(greenApple, 1),
				new CartItem(dell, 1)
			];

			const cost = cartService({ costPerDelivery, costPerProduct, fixedCost }).getDeliveryCost(cart);

			assert.strictEqual(cost, 10.99);
		});
	});
	describe.only('print Tests', function () {
		const campaignsData = [
			new Campaign('Shoes', 30, 2, DiscountType.Amount),
			new Campaign('Food', 50, 5, DiscountType.Rate),
			new Campaign('Fruit', 40, 4, DiscountType.Rate),
			new Campaign('Apple', 30, 3, DiscountType.Amount),
		];
		const categoriesData = [
			new Category('Apple', 'Fruit'),
			new Category('Fruit', 'Food'),
			new Category('Food'),
			new Category('Adidas', 'Shoes'),
			new Category('Shoes')
		];
		const couponsData = [
			new Coupon(100, 1, DiscountType.Rate),
			new Coupon(150, 5, DiscountType.Rate),
			new Coupon(100, 10, DiscountType.Amount),
		];

		const costPerDelivery = 2.5;
		const costPerProduct = 1.5;
		const fixedCost = 2.99;

		const { print } = cartService({ campaignsData, categoriesData, couponsData, costPerDelivery, costPerProduct, fixedCost });

		it('Should return exception if cart is undefined', () => {
			try {
				print(undefined);

				assert.fail('Exception should be thrown');
			} catch (err) {
				assert.strictEqual(err.name, 'ArgumentRequiredError');
			}
		});
		it('Should return 2 categories, 75 initial cart amount, 10.99 delivery cost, 0 total discount, 210.99 total cart amount', () => {
			const greenApple = new Product('Green Apple', 'Fruit', 25);
			const dell = new Product('Dell Notebook', 'Computer', 50);

			const cart = [
				new CartItem(greenApple, 1),
				new CartItem(dell, 1)
			];

			const data = print(cart);

			assert.ok(data);
			assert.ok(data.categories);
			assert.strictEqual(data.categories.length, 2);
			assert.ok(data.categories[0].products);
			assert.strictEqual(data.categories[0].products.length, 1);
			assert.ok(data.initialCartAmount);
			assert.strictEqual(data.initialCartAmount, 75);
			assert.ok(data.deliveryCost);
			assert.strictEqual(data.deliveryCost, 10.99);
			assert.strictEqual(data.totalDiscount, 0);
			assert.ok(data.totalCartAmount);
			assert.strictEqual(data.totalCartAmount, 85.99);
		});
		it('Should return 1 category, 200 initial cart amount, 8.49 delivery cost, 110 total discount, 98.49 total cart amount', () => {
			const greenApple = new Product('Green Apple', 'Fruit', 25);
			const redApple = new Product('Red Apple', 'Fruit', 50);

			const cart = [
				new CartItem(greenApple, 2),
				new CartItem(redApple, 3)
			];

			const data = print(cart);

			assert.ok(data);
			assert.ok(data.categories);
			assert.strictEqual(data.categories.length, 1);
			assert.ok(data.categories[0].products);
			assert.strictEqual(data.categories[0].products.length, 2);
			assert.ok(data.initialCartAmount);
			assert.strictEqual(data.initialCartAmount, 200);
			assert.ok(data.deliveryCost);
			assert.strictEqual(data.deliveryCost, 8.49);
			assert.strictEqual(data.totalDiscount, 110);
			assert.ok(data.totalCartAmount);
			assert.strictEqual(data.totalCartAmount, 98.49);
		});
	});
});