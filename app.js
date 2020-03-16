const campaignsData = require('./data/campaigns');
const categoriesData = require('./data/categories');
const couponsData = require('./data/coupons');

const { DeliveryCost } = require('./domains/enums');
const costPerDelivery = DeliveryCost.CostPerDelivery;
const costPerProduct = DeliveryCost.CostPerProduct;
const fixedCost = DeliveryCost.FixedCost;

const cartService = require('./services/cart');

const Product = require('./domains/product');
const CartItem = require('./domains/cartItem');

const { print } = cartService({ campaignsData, categoriesData, couponsData, costPerDelivery, costPerProduct, fixedCost });

const greenApple = new Product('Green Apple', 'Fruit', 2);
const orange = new Product('Orange', 'Fruit', 3);
const dellNotebook = new Product('Dell Notebook', 'Notebook', 300);

const cart = [
	new CartItem(greenApple, 25),
	new CartItem(orange, 10),
	new CartItem(dellNotebook, 1)
];

console.dir(print(cart), { depth: null });