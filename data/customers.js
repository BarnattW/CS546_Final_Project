import { ObjectId } from "mongodb";
import { customers, listings } from "../config/mongoCollections.js";
import {
	checkId,
	checkIsPositiveInteger,
	checkString,
} from "../utils/checks.js";

/*
 * Creates a customer, add them to the database and returns the new customer
 */
const createCustomer = async (username, password, name) => {
	username = checkString(username);
	password = checkString(password); // look into hashing and authentication
	name = checkString(name);

	const customersCollection = await customers();
	const newCustomer = {
		username: username,
		password: password,
		name: name,
		orders: [],
		cart: [],
		wishlist: [],
		reviews: [],
		comments: [],
	};

	const insertInfo = await customersCollection.insertOne(newCustomer);

	if (!insertInfo.acknowledged || !insertInfo.insertedId)
		throw "Could not create customer";

	const newId = insertInfo.insertedId.toString();
	const customer = await getCustomerById(newId);
	return customer;
};

/* TO-DO
 * Login a customer
 */
const loginCustomer = async (username, password) => {};

/*
 * Returns a customer from db given a customer's id
 */
const getCustomerById = async (id) => {
	id = checkId(id);
	const customersCollection = await customers();
	const customer = await customersCollection.findOne({ _id: new ObjectId(id) });
	if (!customer) throw "Error: Customer not found";

	return customer;
};

/*
 * Cart item subdocument: {
 *    listingId : ObjectId
 *    quantity : Number
 * }
 */

/* TO-DO
 * Return's a customer's cart
 */
const getCustomerCart = async (customerId) => {
	customerId = checkId(customerId);

	// fetch cart
	const customersCollection = await customers();
	const customerCart = await customersCollection.findOne(
		{
			_id: new ObjectId(customerId),
		},
		{ projection: { _id: 0, cart: 1 } }
	);

	if (!customerCart) throw `No cart found for customer with id ${customerId}`;
	// populate cart with listings by first retreiving listing data and then merging
	const listingsCollection = listings();
	const listingIds = customerCart.map((cartItem) => cartItem.listingId);
	const listings = listingsCollection
		.find({
			_id: { $in: listingIds },
		})
		.toArray();

	const populatedCart = customerCart.map((cartItem) => {
		const item = listings.find((listing) => {
			listing._id === cartItem._id;
		});
		return {
			_id: cart._id,
			listing: item,
			quantity: cartItem.quantity,
		};
	});

	return populatedCart;
};

/*
 * Adds a listing to a customer's cart and returns the cart
 */
const addToCart = async (customerId, listingId, quantity) => {
	customerId = checkId(customerId);
	listingId = checkId(listingId);
	checkIsPositiveInteger(quantity);
	const newItem = {
		listingId: listingId,
		quantity: quantity,
	};

	const customersCollection = await customers();
	const updatedCart = await customersCollection.updateOne(
		{
			_id: new ObjectId(customerId),
		},
		{
			$push: { cart: newItem },
		}
	);

	if (updatedCart.modifiedCount != 1)
		throw `Could not add to cart with customer id %{customerId}`;

	return await getCustomerCart(customerId);
};

/*
 * Update a customer's cart and returns the cart
 */
const updateCart = async (customerId, listingId, quantity) => {
	customerId = checkId(customerId);
	listingId = checkId(listingId);
	checkIsPositiveInteger(quantity);

	const customersCollection = await customers();
	let updatedCart;
	// deletes item from cart if quantity is 0, otherwise updates cart with an item
	if (quantity === 0) {
		updatedCart = await customersCollection.updateOne(
			{
				_id: new ObjectId(customerId),
			},
			{
				$pull: { cart: { listingId: new ObjectId(listingId) } },
			}
		);
	} else {
		updatedCart = await customersCollection.updateOne(
			{
				_id: new ObjectId(customerId),
				"cart.listingId": new ObjectId(listingId),
			},
			{
				$set: { "cart.$.quantity": quantity },
			}
		);
	}

	if (updatedCart.modifiedCount != 1)
		throw `Could not update cart with customer id ${customerId}`;

	return await getCustomerCart(customerId);
};

/*
 * Wishlists subdocument:
 * {
 * listingId : ObjectId}
 * }
 */

/*
 * Returns a customer's wishlist
 */
const getCustomerWishlist = async (customerId) => {
	customerId = checkId(customerId);

	// fetch cart
	const customersCollection = await customers();
	const customerWishlist = await customersCollection.findOne(
		{
			_id: new ObjectId(customerId),
		},
		{ projection: { _id: 0, wishlist: 1 } }
	);

	if (!customerWishlist)
		throw `No wishlist found for customer with id ${customerId}`;

	// populate cart with listings by first retreiving listing data and then merging
	const listingsCollection = listings();
	const listingIds = customerCart.map((cartItem) => cartItem.listingId);
	const listings = listingsCollection
		.find({
			_id: { $in: listingIds },
		})
		.toArray();

	const populatedWishlist = customerWishlist.map((wishlistItem) => {
		const item = listings.find((listing) => {
			listing._id === wishlistItem._id;
		});
		return {
			_id: cart._id,
			listing: item,
			quantity: cartItem.quantity,
		};
	});

	return populatedWishlist;
};

/*
 * Adds a listing to a customer's wishlist and returns the wishlist
 */
const addToWishlist = async (customerId, listingId) => {
	customerId = checkId(customerId);
	listingId = checkId(listingId);
	const newItem = {
		listingId: listingId,
	};

	const customersCollection = await customers();
	const updatedCart = await customersCollection.updateOne(
		{
			_id: new ObjectId(customerId),
		},
		{
			$push: { wishlist: newItem },
		}
	);

	if (updatedCart.modifiedCount != 1)
		throw `Could not update wishlist with customer id %{customerId}`;

	return await getCustomerWishlist(customerId);
};

/*
 * Removes an item from the wishlist and returns the wishlist
 */
const removeFromWishlist = async (customerId, listingId) => {
	customerId = checkId(customerId);
	listingId = checkId(listingId);

	const customersCollection = await customers();
	let updatedWishlist = await customersCollection.updateOne(
		{
			_id: new ObjectId(customerId),
		},
		{
			$pull: { wishlist: { listingId: new ObjectId(listingId) } },
		}
	);

	if (updatedWishlist.modifiedCount != 1)
		throw `Could not update wishlist with customer id ${customerId}`;

	return await getCustomerWishlist(customerId);
};

export const customerDataFunctions = {
	createCustomer,
	getCustomerById,
	getCustomerCart,
	addToCart,
	updateCart,
	getCustomerWishlist,
	addToWishlist,
	removeFromWishlist,
};
