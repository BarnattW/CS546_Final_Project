import { ObjectId } from "mongodb";
import { customers, sellers } from "../config/mongoCollections.js";
import {
	checkId,
	checkIsPositiveInteger,
	checkString,
} from "../utils/checks.js";
import { sellersData } from "./index.js";

/* TO-DO
 * Orders -> likely to change to support payment info and shipping status
 * {
 *  customerId : ObjectId,
 *  orderItems : [],
 *  shippingAddress : String,
 *  cost : Number,
 *  orderDate : Date,
 *  cardNumber : String,
 *  orderStatus : String // Received, Shipping, Delivered
 * }
 */

/*
 * Given an array of itemIds, return an array of populated listing items
 */
const populateOrderItems = async (orderItems) => {
	orderItems.forEach((item) => {
		if (item.listingId) item.listingId = item.listingId.toString();
		else _id = _id.toString();
	});

	const populatedItems = await Promise.all(
		orderItems.map(async (item) => {
			let listing;
			if (item.listingId) {
				listing = await sellersData.getListingById(item.listingId);
			} else listing = await sellersData.getListingById(item._id);
			return {
				listing,
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
	const customer = await customersCollection.findOne(
		{
			_id: new ObjectId(customerId),
		},
		{
			projection: { _id: 1, orders: 1 },
		}
	);

	if (!customers) throw `No orders found for customer with id ${customerId}`;

	// populate orders with items
	const customerOrders = customer.orders;
	if (customerOrders.length === 0) return;
	await Promise.all(
		customerOrders.map(async (order) => {
			order.orderItems = await populateOrderItems(order.orderItems);
		})
	);

	return customerOrders;
};

/*
 * Returns a customer's order with populated listings
 */
const getCustomerOrder = async (customerId, orderId) => {
	customerId = checkId(customerId);
	orderId = checkId(orderId);

	const customersCollection = await customers();
	// get only order with matching orderId
	let customerOrder = await customersCollection.findOne(
		{
			_id: new ObjectId(customerId),
			"orders._id": new ObjectId(orderId),
		},
		{
			projection: {
				_id: 1,
				orders: {
					$elemMatch: { _id: new ObjectId(orderId) },
				},
			},
		}
	);

	if (!customerOrder) throw `No order found with orderId ${orderId}`;

	customerOrder.orders[0].orderItems = await populateOrderItems(
		customerOrder.orders[0].orderItems
	);

	return customerOrder.orders[0];
};

/*
 * Returns all seller orders
 */
const getSellerOrders = async (sellerId) => {
	sellerId = checkId(sellerId, "sellerId");

	const sellersCollection = await sellers();
	const seller = await sellersCollection.findOne(
		{
			_id: new ObjectId(sellerId),
		},
		{
			projection: { _id: 1, orders: 1 },
		}
	);

	if (!seller) throw `No orders found for seller with id ${sellerId}`;

	// populate each order's orderItems
	const sellerOrders = seller.orders;
	if (sellerOrders.length === 0) return;
	await Promise.all(
		sellerOrders.map(async (order) => {
			console.log(order.orderItems);
			order.orderItems = await populateOrderItems(order.orderItems);
		})
	);

	return sellerOrders;
};

/*
 * Returns a particular seller orders
 */
const getSellerOrder = async (sellerId, orderId) => {
	sellerId = checkId(sellerId, "sellerId");
	orderId = checkId(orderId, "orderId");

	const sellersCollection = await sellers();
	const sellerOrder = await sellersCollection.findOne(
		{
			_id: new ObjectId(customerId),
			"orders._id": new ObjectId(orderId),
		},
		{
			projection: {
				_id: 1,
				orders: {
					$elemMatch: { _id: new ObjectId(orderId) },
				},
			},
		}
	);

	if (!sellerOrder) throw `No order found with orderId ${orderId}`;

	sellerOrder.orders[0].orderItems = await populateOrderItems(
		sellerOrder.orders[0].orderItems
	);

	return sellerOrder.orders[0];
};

/*
 * Creates a new order for a user and associated sellers
 */
const createOrder = async (
	customerId,
	name,
	orderItems,
	shippingAddress,
	cardNumber,
	cost
) => {
	// replicate order across both sellers and the customer
	customerId = checkId(customerId, "customerId");
	name = checkString(name, "name");
	shippingAddress = checkString(shippingAddress, "shippingAddress");
	checkString(cardNumber, "cardNumber");
	if (cardNumber.length !== 16) throw "Invalid card number";
	checkIsPositiveInteger(cost);

	const newOrderId = new ObjectId();
	const newOrder = {
		_id: newOrderId,
		customerId,
		name,
		orderItems,
		shippingAddress,
		cost,
		cardNumber,
		orderDate: new Date(),
	};

	const customersCollection = await customers();
	const sellersCollection = await sellers();
	const updatedCustomerOrders = await customersCollection.updateOne(
		{
			_id: new ObjectId(customerId),
		},
		{
			$push: { orders: newOrder },
		}
	);

	if (updatedCustomerOrders.modifiedCount != 1)
		throw `Could not create an order for customer id ${customerId}`;

	// empty customer cart
	const updatedCustomerCart = await customersCollection.updateOne(
		{
			_id: new ObjectId(customerId),
		},
		{
			$set: { cart: [] },
		}
	);

	if (updatedCustomerCart.modifiedCount != 1)
		throw `Could not empty cart for customer id ${customerId}`;

	// for each order item, find their associated seller and push orders to them
	const sellerOrders = {};
	await Promise.all(
		orderItems.map(async (orderItem) => {
			const listing = await sellersData.getListingById(
				orderItem.listingId.toString()
			);
			sellerOrders[listing.sellerId] = listing;
		})
	);

	// update seller order data
	for (const sellerId in sellerOrders) {
		const newOrd = {
			_id: newOrderId,
			customerId: customerId,
			name,
			orderItems: [sellerOrders[sellerId]],
			shippingAddress: shippingAddress,
			cost: cost,
			cardNumber: cardNumber,
			orderDate: new Date(),
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

	// update to return customer's new order
	return;
};

// delete order fro customer and seller
async function deleteCustomerOrder(userId, orderId) {
	const orderCollection = await db.collection("orders");
	const deletionInfo = await orderCollection.deleteOne({
		_id: new ObjectId(orderId),
		userId: new ObjectId(userId),
	});

	return deletionInfo.deletedCount > 0;
}

async function deleteSellerOrder(sellerId, orderId) {
	const orderCollection = await db.collection("orders");
	const deletionInfo = await orderCollection.deleteOne({
		_id: new ObjectId(orderId),
		sellerId: new ObjectId(sellerId),
	});

	return deletionInfo.deletedCount > 0;
}

export const orderDataFunctions = {
	getCustomerOrders,
	getCustomerOrder,
	getSellerOrders,
	getSellerOrder,
	createOrder,
	deleteCustomerOrder,
	deleteSellerOrder,
};
