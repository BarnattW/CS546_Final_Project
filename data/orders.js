import { ObjectId } from "mongodb";
import { customers, listings, sellers } from "../config/mongoCollections.js";
import { checkId, checkIsPositiveInteger, checkString } from "../utils/checks.js";

/* TO-DO
 * Orders -> likely to change to support payment info and shipping status
 * {
 *  customerId : ObjectId,
 *  orderItems : [],
 *  shippingAddress : String,
 *  cost : Number,
 *  orderDate : Date,
 * }
 */

/*
 * Given an array of itemIds, return an array of populated listing items
 */
const populateOrderItems = async (itemIds) => {
	const listingsCollection = await listings();
	const listings = listingsCollection
		.find({
			_id: { $in: itemIds },
		})
		.toArray();

	// preserve order
	const populatedItems = itemIds.map((itemId) => {
		return listings.find((listing) => {
			listing._id === itemId;
		});
	});
	return populatedItems;
};

/*
 * Returns a customer's populated orders
 */
const getCustomerOrders = async (customerId) => {
	customerId = checkId(customerId);

	const customersCollection = await customers();
	const customerOrders = await customersCollection.findOne(
		{
			_id: new ObjectId(customerId),
		},
		{
			projection: { _id: 0, orders: 1 },
		}
	);

	if (!customerOrders)
		throw `No orders found for customer with id ${customerId}`;

	if (customerOrders.length === 0) return;

	// populate orders with items
	customerOrders.forEach((order) => {
		order.orderItems = populateOrderItems(order.orderItems);
	});

	return customerOrders;
};

/*
 * Returns a customer's order with populated listings
 */
const getCustomerOrder = async (customerId, orderId) => {
	customerId = checkId(customerId);
	orderId = checkId(orderId);

	const customersCollection = await customers();
	const customerOrder = await customersCollection.findOne(
		{
			_id: new ObjectId(customerId),
			"orders._id": orderId,
		},
		{
			projection: { _id: 0, orders: 1 },
		}
	);

	print(customerOrder);
	if (!customerOrder || customerOrder.length === 0)
		throw `No order found with orderId ${orderId}`;

	customerOrder = customerOrder[0];
	customerOrder.orderItems = populateOrderItems(customerOrder.orderItems);

	return customerOrder;
};

const getSellerOrders = async (sellerId) => {
	sellerId = checkId(sellerId);

	const sellersCollection = await sellers();
	const sellerOrders = await sellersCollection.findOne(
		{
			_id: new ObjectId(sellerId),
		},
		{
			projection: { _id: 0, orders: 1 },
		}
	);

	if (!sellerOrders) throw `No orders found for seller with id ${sellerId}`;

	if (sellerOrders.length === 0) return;

	// populate each order's orderItems
	sellerOrders.forEach((order) => {
		order.orderItems = populateOrderItems(order.orderItems);
	});

	return sellerOrders;
};

const createOrder = async (
	customerId,
	orderItems,
	shippingAddress,
	cost,
	orderDate
) => {
	// replicate order across both sellers and the customer
	customerId = checkId(customerId);
	// check orderItems
    shippingAddress = checkString(shippingAddress); // update to check address
    cost = checkIsPositiveInteger(cost);
    // check orderDate
};

// optional
const deleteOrder = async (sellerId, orderId) => {};

export { getCustomerOrders, getCustomerOrder, getSellerOrders, createOrder };
