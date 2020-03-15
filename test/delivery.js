const assert = require('assert');

const deliveryService = require('../services/delivery');

const Product = require('../domains/product');
const CartItem = require('../domains/cartItem');
const Category = require('../domains/category');

describe('Delivery Service Tests', function () {
    describe('Calculate Delivery Cost', function () {
        const costPerDelivery = 2.0;
        const costPerProduct = 1.0;
        const fixedCost = 2.99;
        let deliveryCostCalculator;

        this.beforeAll(() => {
            deliveryCostCalculator = deliveryService.calculateDeliveryCost(costPerDelivery, costPerProduct, fixedCost);
        });

        it('Should return exception if cart is undefined', () => {
            try {
                deliveryCostCalculator(undefined);

                assert.fail('Exception should be thrown');
            } catch (err) {
                assert.strictEqual(err.name, 'ArgumentRequiredError');
            }
        });
        it('Should return 0 if cart is empty', () => {
            const cart = [];
            const deliveryCost = deliveryCostCalculator(cart);

            assert.strictEqual(deliveryCost, 0);
        });
        it('Should return 10.99 if cart has 4 different products from 2 different categories', () => {
            const foodCategory = new Category('Food');
            const shoesCategory = new Category('Shoes');

            const bread = new Product('Bread', foodCategory.name);
            const egg = new Product('Egg', foodCategory.name);
            const adidas = new Product('Adidas', shoesCategory.name);
            const nike = new Product('Nike', shoesCategory.name);

            const cart = [
                new CartItem(bread, 4), 
                new CartItem(egg, 20), 
                new CartItem(adidas, 2), 
                new CartItem(nike, 1)
            ];

            const deliveryCost = deliveryCostCalculator(cart);

            assert.strictEqual(deliveryCost, 10.99);
        });
        it('Should return 7.99 if cart has 3 different products from same single category', () => {
            const foodCategory = new Category('Food');

            const bread = new Product('Bread', foodCategory.name);
            const egg = new Product('Egg', foodCategory.name);
            const milk = new Product('Milk', foodCategory.name);

            const cart = [
                new CartItem(bread, 4), 
                new CartItem(egg, 20), 
                new CartItem(milk, 2)
            ];

            const deliveryCost = deliveryCostCalculator(cart);

            assert.strictEqual(deliveryCost, 7.99);
        });
        it('Should return 5.99 if cart has single product', () => {
            const foodCategory = new Category('Food');

            const bread = new Product('Bread', foodCategory.name);

            const cart = [
                new CartItem(bread, 4)
            ];

            const deliveryCost = deliveryCostCalculator(cart);

            assert.strictEqual(deliveryCost, 5.99);
        });
    });
});