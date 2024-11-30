import { sellers } from "../config/mongoCollections.js";
import { checkId } from "../utils/checks.js";

const createSeller = async (username, password, name, town) => {};

/*
 * Returns a Seller from db given a Seller's id
 */
const getSellerById = async (id) => {
	id = checkId(id);
	const sellersCollection = await sellers();
	const seller = await sellersCollection.findOne({ _id: new ObjectId(id) });
	if (!seller) throw "Error: Seller not found";

	return sellersCollection;
};

const getAllListings = async () => {};

const getAllSellerListings = async (sellerId) => {};

const getSellerListing = async (sellerId) => {};

const createListing = async (
	sellerId,
	itemName,
	itemDescription,
	itemPrice,
	itemImage,
	itemCategory,
	condition
) => {};

const updateListing = async (
	listingId,
	itemName,
	itemDescription,
	itemPrice,
	itemImage,
	itemCategory,
	condition
) => {};

const deleteListing = async () => {};

/*
 * The one below is a doozy
 */
const searchForListing = async (queryParams) => {};

export const sellerDataFunctions = {
	createSeller,
	getSellerById,
	getAllListings,
	getAllSellerListings,
	getSellerListing,
	createListing,
	updateListing,
	deleteListing,
	searchForListing,
};
