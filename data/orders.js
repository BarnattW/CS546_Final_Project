import { ObjectId } from "mongodb";
import { customers, sellers } from "../config/mongoCollections.js";
import {
	checkDate,
	checkId,
	checkIsPositiveInteger,
	checkString,
} from "../utils/checks.js";
import { sellerDataFunctions } from "./seller.js";

/* TO-DO
 * Orders -> likely to change to support payment info and shipping status
 * {
 *  customerId : ObjectId,
 *  orderItems : [],
 *  shippingAddress : String,
 *  cost : Number,
 *  orderDate : Date,
 *  orderStatus : String // Received, Shipping, Delivered
 * }
 */

/*
 * Given an array of itemIds, return an array of populated listing items
 */
const populateOrderItems = async (itemIds) => {
	itemIds.forEach((itemId) => {
		itemId = itemId.toString();
	});

	const populatedItems = await Promise.all(
		itemIds.map(async (itemId) => {
			const listing = await sellerDataFunctions.getListingById(itemId);
			return {
				_id: itemId,
				listing: listing,
			};
		})
	);
	return populatedItems;
};

/*
 * Returns a customer's populated orders
 */
const getCustomerOrders = async (customerId) => {
	customerId = checkId(customerId, "customerId");

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

/*
 * Returns all seller orders
 */
const getSellerOrders = async (sellerId) => {
	sellerId = checkId(sellerId, "sellerId");

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

/*
 * Creates a new order for a user and associated sellers
 */
const createOrder = async (
	customerId,
	orderItems,
	shippingAddress,
	cost,
	orderDate
) => {
	// replicate order across both sellers and the customer
	customerId = checkId(customerId, "customerId");
	orderItems.map((itemId) => {
		return checkId(itemId, "itemId");
	});
	// check if orderItems are valid items
	shippingAddress = checkString(shippingAddress, "shippingAddress"); // update to check address
	checkIsPositiveInteger(cost);
	checkDate(orderDate);

	const newOrder = {
		customerId: customerId,
		orderItems: orderItems,
		shippingAddress: shippingAddress,
		cost: cost,
		orderDate: orderDate,
	};

	const customersCollection = customers();
	const sellersCollection = await sellers();
	const updatedCustomerOrders = await customersCollection.updateOne(
		{
			_id: new ObjectId(customerId),
		},
		{
			$push: { orders: newOrder },
		}
	);

	if (!updatedCustomerOrders.modifiedCount != 1)
		throw `Could not create an order for customer id ${customerId}`;

	// for each order item, find their associated seller and push orders to them
	const sellerOrders = {};
	await Promise.all(
		orderItems.forEach(async (listingId) => {
			const listing = await sellerDataFunctions.getListingById(listingId);
			sellerOrders[listing.sellerId] = listing;
		})
	);

	// update seller order data
	for (const sellerId in sellerOrders) {
		const newOrd = {
			customerId: customerId,
			orderItems: sellerOrders[sellerId],
			shippingAddress: shippingAddress,
			cost: cost,
			orderDate: orderDate,
		};
		const updatedSellerOrders = await sellersCollection.updateOne(
			{
				_id: new ObjectId(sellerId),
			},
			{
				$push: { orders: newOrd },
			}
		);

		if (updatedSellerOrders.modifiedCount != 1)
			throw `Error while updating seller orders`;
	}

	return await getCustomerOrders(customerId);
};

// optional
const deleteOrder = async (sellerId, orderId) => {};

export { getCustomerOrders, getCustomerOrder, getSellerOrders, createOrder };
