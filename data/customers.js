import { ObjectId } from "mongodb";
import { customers } from "../config/mongoCollections.js";
import {
	checkId,
	checkIsPositiveInteger,
	checkString,
	checkStringLength,
} from "../utils/checks.js";
import bcrypt from "bcrypt";
import { getListingById } from "./seller.js";

const saltRounds = 12;

/*
 * Creates a customer, add them to the database and returns the new customer
 */
const createCustomer = async (username, password, name) => {
	username = checkString(username, "username");
	password = checkString(password, "password");
	name = checkString(name, "name");
	checkStringLength(username, 5, 20);
	checkStringLength(password, 8);

	const customersCollection = await customers();
	const existingUser = await customersCollection.findOne({ username });
	if (existingUser) throw "There is already a customer with that username";

	const hashedPassword = await bcrypt.hash(password, saltRounds);
	const newCustomer = {
		username,
		password: hashedPassword,
		name,
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
	// TODO - see if this is essential...
	const customer = await getCustomerById(newId);
	return customer;
};

/*
 * Login a customer
 */
const loginCustomer = async (username, password) => {
	username = checkString(username, "username");
	password = checkString(password, "password");
	checkStringLength(username, 5, 20);
	checkStringLength(password, 8);

	const customersCollection = await customers();
	const customer = await customersCollection.findOne({ username });

	if (!customer) throw "Invalid username or password";

	const comparePassword = await bcrypt.compare(password, customer.password);

	if (!comparePassword) throw "Invalid username or password";
	return { username: customer.username, _id: customer._id.toString() };
};

/*
 * Returns a customer from db given a customer's id
 */
const getCustomerById = async (id) => {
	id = checkId(id, "customerId");
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

/*
 * Return's a customer's cart
 */
const getCustomerCart = async (customerId) => {
	customerId = checkId(customerId, "customerId");

	// fetch cart
	const customersCollection = await customers();
	const customer = await customersCollection.findOne(
		{
			_id: new ObjectId(customerId),
		},
		{ projection: { _id: 0, cart: 1 } }
	);

	if (!customer) throw `No cart found for customer with id ${customerId}`;

	// populate cart with listings
	const customerCart = customer.cart;
	customerCart.forEach((cartItem) => {
		cartItem.listingId = cartItem.listingId.toString();
	});

	let totalItems = 0;
	let totalPrice = 0;
	const populatedCart = await Promise.all(
		customerCart.map(async (cartItem) => {
			const listing = await getListingById(cartItem.listingId);
			totalItems += cartItem.quantity;
			totalPrice += cartItem.quantity * listing.itemPrice;
			return {
				listingId: cartItem.listingId,
				listing: listing,
				quantity: cartItem.quantity,
			};
		})
	);

	return { populatedCart, totalItems, totalPrice };
};

/*
 * Adds a listing to a customer's cart and returns the cart
 */
const addToCart = async (customerId, listingId, quantity) => {
	customerId = checkId(customerId, "customerId");
	listingId = checkId(listingId, "listingId");
	checkIsPositiveInteger(quantity);

	const customersCollection = await customers();
	let updatedCart;

	const existingItem = await customersCollection.findOne(
		{
			_id: new ObjectId(customerId),
			"cart.listingId": new ObjectId(listingId),
		},
		{
			projection: { "cart.$": 1 }, // Only return the matching cart item
		}
	);

	if (existingItem) {
		const currentQuantity = existingItem.cart[0].quantity;
		const newQuantity = Math.min(currentQuantity + quantity, 5);
		updatedCart = await customersCollection.updateOne(
			{
				_id: new ObjectId(customerId),
				"cart.listingId": new ObjectId(listingId),
			},
			{
				$set: { "cart.$.quantity": newQuantity },
			}
		);
		if (newQuantity === 5) throw `Item already at maximum quantity of 5`;
	} else {
		const newItem = {
			listingId: new ObjectId(listingId),
			quantity: quantity,
		};
		updatedCart = await customersCollection.updateOne(
			{
				_id: new ObjectId(customerId),
			},
			{
				$push: { cart: newItem },
			}
		);
	}

	if (updatedCart.modifiedCount != 1)
		throw `Could not add to cart with customer id ${customerId}`;

	return await getCustomerCart(customerId);
};

/*
 * Update a customer's cart and returns the cart
 */
const updateCart = async (customerId, listingId, quantity) => {
	customerId = checkId(customerId, "customerId");
	listingId = checkId(listingId, "listingId");
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
		const newQuantity = Math.min(quantity, 5);
		if (newQuantity === 5) throw `Item already at maximum quantity of 5`;

		updatedCart = await customersCollection.updateOne(
			{
				_id: new ObjectId(customerId),
				"cart.listingId": new ObjectId(listingId),
			},
			{
				$set: { "cart.$.quantity": newQuantity },
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
	customerId = checkId(customerId, "customerId");

	// fetch cart
	const customersCollection = await customers();
	const customer = await customersCollection.findOne(
		{
			_id: new ObjectId(customerId),
		},
		{ projection: { _id: 0, wishlist: 1 } }
	);

	if (!customer) throw `No wishlist found for customer with id ${customerId}`;

	// populate wishlist with listings
	const customerWishlist = customer.wishlist;
	customerWishlist.forEach((wishlistItem) => {
		wishlistItem.listingId = wishlistItem.listingId.toString();
	});

	const populatedWishlist = await Promise.all(
		customerWishlist.map(async (wishlistItem) => {
			const listing = await getListingById(wishlistItem.listingId);
			return {
				listing: listing,
			};
		})
	);

	return populatedWishlist;
};

/*
 * Adds a listing to a customer's wishlist and returns the wishlist
 */
const addToWishlist = async (customerId, listingId) => {
	customerId = checkId(customerId, "customerId");
	listingId = checkId(listingId, "customerId");
	const newItem = {
		listingId: new ObjectId(listingId),
	};

	const customersCollection = await customers();
	// check if already in wishlist
	const existingItem = await customersCollection.findOne({
		_id: new ObjectId(customerId),
		"wishlist.listingId": new ObjectId(listingId),
	});
	if (existingItem) throw `Item already in wishlist`;

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
	customerId = checkId(customerId, "customerId");
	listingId = checkId(listingId, "listingId");

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

/*
 * Moves a wishlist item to the cart
 */
const moveFromWishlistToCart = async (customerId, listingId) => {
	customerId = checkId(customerId, "customerId");
	listingId = checkId(listingId, "listingId");

	const customersCollection = await customers();
	const customer = await customersCollection.findOne(
		{
			_id: new ObjectId(customerId),
		},
		{ projection: { _id: 0, wishlist: 1, cart: 1 } }
	);

	if (!customer) throw `No customer found with id ${customerId}`;

	const existingItem = customer.wishlist.find(
		(wishlistItem) => wishlistItem.listingId.toString() === listingId
	);

	if (!existingItem) throw `Item not found in wishlist`;

	// check if item already exists in cart. If so, return an error
	const existingCartItem = customer.cart.find(
		(cartItem) => cartItem.listingId.toString() === listingId
	);
	if (existingCartItem) throw `Item already in cart`;

	const updatedCart = await customersCollection.updateOne(
		{
			_id: new ObjectId(customerId),
		},
		{
			$push: { cart: existingItem },
			$pull: { wishlist: { listingId: new ObjectId(listingId) } },
		}
	);

	if (updatedCart.modifiedCount != 1)
		throw `Could not update cart with customer id ${customerId}`;

	return await getCustomerCart(customerId);
};

export const customersDataFunctions = {
	createCustomer,
	getCustomerById,
	getCustomerCart,
	addToCart,
	updateCart,
	getCustomerWishlist,
	addToWishlist,
	removeFromWishlist,
	loginCustomer,
	moveFromWishlistToCart,
};
