const assert = require('assert');

const CartItem = require('../domains/cartItem');
const Product = require('../domains/product');
const Campaign = require('../domains/campaign');
const Coupon = require('../domains/coupon');
const Category = require('../domains/category');

const { DeliveryCost, DiscountType } = require('../domains/enums');
const costPerDelivery = DeliveryCost.CostPerDelivery; 
const costPerProduct = DeliveryCost.CostPerProduct;
const fixedCost = DeliveryCost.FixedCost;

const cartService = require('../services/cart');

const categoriesData = [
	new Category('Apple', 'Fruit'),
	new Category('Fruit', 'Food'),
	new Category('Food'),
	new Category('Adidas', 'Shoes'),
	new Category('Shoes')
];

describe('Cart Service Tests', function () {
	describe('getCouponDiscount Tests', function () {
		it('Should return exception if cart is undefined', () => {
			try {
				const couponsData = [
					new Coupon(100, 10, DiscountType.Rate),
					new Coupon(150, 5, DiscountType.Rate),
					new Coupon(100, 10, DiscountType.Amount),
				];
				cartService({couponsData}).getCouponDiscount(undefined);

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
			
			const discount = cartService({couponsData}).getCouponDiscount(cart);

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

			const discount = cartService({couponsData}).getCouponDiscount(cart);

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
			
			const discount = cartService({couponsData}).getCouponDiscount(cart);

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
			
			const discount = cartService({couponsData}).getCouponDiscount(cart);

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

			const discount = cartService({couponsData}).getCouponDiscount(cart);

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
		it('Should return exception if cart is undefined', () => {
			try {
				cartService({campaignsData, categoriesData}).getCampaignDiscount(undefined);

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

			const discount = cartService({campaignsData, categoriesData}).getCampaignDiscount(cart);

			assert.strictEqual(discount, 0);
		});
		it('Should return 100 for 5 product from Food category with 200 total price', () => {
			const apple = new Product('Green Apple', 'Food', 40);

			const cart = [
				new CartItem(apple, 5)
			];

			const discount = cartService({campaignsData, categoriesData}).getCampaignDiscount(cart);

			assert.ok(discount);
			assert.strictEqual(discount, 100);
		});
		it('Should return 0 for 1 product from Food category with 40 total price', () => {
			const apple = new Product('Green Apple', 'Food', 40);

			const cart = [
				new CartItem(apple, 1)
			];

			const discount = cartService({campaignsData, categoriesData}).getCampaignDiscount(cart);

			assert.strictEqual(discount, 0);
		});
		it('Should return 40 for 4 product from Fruit category with 100 total price', () => {
			const apple = new Product('Green Apple', 'Fruit', 25);

			const cart = [
				new CartItem(apple, 4)
			];

			const discount = cartService({campaignsData, categoriesData}).getCampaignDiscount(cart);

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

			const discount = cartService({campaignsData, categoriesData}).getCampaignDiscount(cart);

			assert.ok(discount);
			assert.strictEqual(discount, 4.5);
		});
	});
	describe('getTotalAmountAfterDiscounts Tests', function () {
		
	});
	describe('getDeliveryCost Tests', function () {
		
	});
	describe('print Tests', function () {
		
	});
});