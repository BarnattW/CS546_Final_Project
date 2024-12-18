import { sellers } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { listings } from "../config/mongoCollections.js";
import * as validation from "../utils/checks.js";
import bcrypt from "bcrypt";
import uploadImage from "../utils/imageUpload.js";

const saltRounds = 12;

// Login Seller

export const loginSeller = async (username, password) => {
	username = validation.checkString(username);
	password = validation.checkString(password);
	validation.checkStringLength(username, 5, 20);
	validation.checkStringLength(password, 8);

	username = username.toLowerCase();

	const sellerCollection = await sellers();
	const seller = await sellerCollection.findOne({ username });

	if (!seller) throw "Invalid username or password";

	const comparePassword = await bcrypt.compare(password, seller.password);

	if (!comparePassword) throw "Invalid username or password";

	return { username: seller.username, _id: seller._id.toString() };
};

// Creates a new Seller and returns it.

export const createSeller = async (username, password, businessName, town) => {
	// Validating Parameters
	username = validation.checkString(username);
	password = validation.checkString(password);
	businessName = validation.checkString(businessName);
	town = validation.checkString(town);
	username = username.toLowerCase();
	validation.checkStringLength(username, 5, 20);
	validation.checkStringLength(password, 8);

	const hashedPassword = await bcrypt.hash(password, saltRounds);

	let newSeller = {
		username,
		password: hashedPassword,
		businessName,
		town,
		listings: [],
		orders: [],
	};

	const sellerCollection = await sellers();
	const existingUser = await sellerCollection.findOne({ username });
	if (existingUser) throw "There is already a seller with that username";

	const insertInfo = await sellerCollection.insertOne(newSeller);

	if (!insertInfo.acknowledged || !insertInfo.insertedId)
		throw "Could not add seller.";

	const newId = insertInfo.insertedId.toString();
	const seller = await getSellerById(newId);
	return seller;
};

// Returns all sellers

export const getAllSellers = async () => {
	const sellerCollection = await sellers();
	let sellerList = await teamCollection
		.find({})
		.project({ _id: 1, name: 1 })
		.toArray();
	if (!sellerList) throw "Can not get all Sellers.";
	sellerList = sellerList.map((element) => {
		element._id = element._id.toString();
		return element;
	});
	return sellerList;
};

/*
 * Returns a Seller from db given a Seller's id
 */
const getSellerById = async (id) => {
	id = validation.checkId(id);
	const sellersCollection = await sellers();
	const seller = await sellersCollection.findOne({ _id: new ObjectId(id) });
	if (!seller) throw "Error: Seller not found";

	return seller;
};

// Returns a specific seller's listings array (seller.listing is an array of references aka a listing id)

export const getAllSellerListings = async (sellerId) => {
	sellerId = validation.checkId(sellerId);

	const currSeller = await getSellerById(sellerId);
	if (!currSeller) throw "Error: No seller found with the given sellerId.";

	let currSellerListings = currSeller.listings;

	currSellerListings = await Promise.all(
		currSellerListings.map(async (element) => {
			element = await getListingById(element);
			return element;
		})
	);

	return currSellerListings;
};

// Returns a specific seller's

export const getListingById = async (listingId) => {
	listingId = validation.checkId(listingId, "Listing ID");
	const listingCollection = await listings();
	const listing = await listingCollection.findOne({
		_id: new ObjectId(listingId),
	});

	if (!listing) throw "Can not find listing from that listingId.";
	listing._id = listing._id.toString();
	listing.reviews = listing.reviews.map((review) => {
		if (review._id) review._id = review?._id?.toString();
		return review;
	});
	return listing;
};

export const createListing = async (
	sellerId,
	itemName,
	itemDescription,
	itemPrice,
	itemImage,
	itemCategory,
	condition
) => {
	// Validating parameters
	sellerId = validation.checkId(sellerId, "Seller ID");
	itemName = validation.checkString(itemName, "Item Name");
	itemDescription = validation.checkString(itemDescription, "Item Description");
	validation.checkIsPositiveNumber(itemPrice);
	itemImage = validation.checkString(itemImage, "Item Image");
	itemCategory = validation.checkString(itemCategory, "Item Catagory");
	condition = validation.checkString(condition, "Condition");

	itemImage = await uploadImage(itemImage); // returns the image url
	sellerId = new ObjectId(sellerId);
	let newListing = {
		sellerId,
		itemName,
		itemDescription,
		itemPrice,
		itemImage,
		itemCategory,
		condition,
		reviews: [],
		comments: [],
	};

	const listingCollection = await listings();
	const insertInfo = await listingCollection.insertOne(newListing);
	if (!insertInfo.acknowledged || !insertInfo.insertedId)
		throw "Could not add listing.";

	const sellerCollection = await sellers();
	const sellerListingInsert = await sellerCollection.updateOne(
		{
			_id: sellerId,
		},
		{ $push: { listings: insertInfo.insertedId.toString() } }
	);

	if (sellerListingInsert.modifiedCount === 0) {
		// rollback insertion
		const deleteListing = await listingCollection.deleteOne({
			_id: insertInfo.insertedId,
		});
		if (!deleteListing.deletedCount) {
			throw "Failed to rollback listing insertion";
		}

		throw "Could not update seller with the new listing.";
	}

	const newId = insertInfo.insertedId.toString();
	const listing = await getListingById(newId);
	return listing;
};

// Returns all listing furniture

export const getAllListings = async () => {
	const listingCollection = await listings();
	let listingList = await listingCollection.find({}).toArray();
	if (!listingList) throw "Could not get all listings.";
	listingList = listingList.map((eachListing) => {
		eachListing._id = eachListing._id.toString();
		return eachListing;
	});
	return listingList;
};

// Updates a Listing's information

export const updateListing = async (
	listingId,
	itemName,
	itemDescription,
	itemPrice,
	itemImage,
	itemCategory,
	condition
) => {
	listingId = validation.checkId(listingId, "Listing ID");
	itemName = validation.checkString(itemName, "Item Name");
	itemDescription = validation.checkString(itemDescription, "Item Description");
	validation.checkIsPositiveNumber(itemPrice);
	if (itemPrice < 1 || itemPrice > 10000)
		throw `Price must be between 1 and 10000`;
	itemImage = validation.checkString(itemImage, "Item Image");
	itemCategory = validation.checkString(itemCategory, "Item Catagory");
	condition = validation.checkString(condition, "Condition");

	itemImage = await uploadImage(itemImage);
	const updatedListing = {
		itemName,
		itemDescription,
		itemPrice,
		itemImage,
		itemCategory,
		condition,
	};

	const listingCollection = await listings();
	const updatedInfo = await listingCollection.findOneAndUpdate(
		{ _id: new ObjectId(listingId) },
		{ $set: updatedListing },
		{ returnDocument: "after" }
	);

	if (!updatedInfo) throw "Could not update listing.";

	updatedInfo._id = updatedInfo._id.toString();

	return updatedInfo;
};

// Deletes a listing from the listing collection
// Delete the reference from the seller's listing array

export const deleteListing = async (listingId) => {
	listingId = validation.checkId(listingId, "Listing ID");
	const listingCollection = await listings();
	const sellerCollection = await sellers();
	const deletionInfoListing = await listingCollection.findOneAndDelete({
		_id: new ObjectId(listingId),
	});
	if (!deletionInfoListing)
		throw `Could not delete listing with id:${listingId}`;

	const deletionInfoSeller = await sellerCollection.updateOne(
		{ listings: listingId },
		{ $pull: { listings: listingId } }
	);

	if (!deletionInfoSeller.modifiedCount == 1)
		throw `Could not delete listing with id:${listingId} from seller`;

	return `${deletionInfoListing.name} have been successfully deleted!`;
};
