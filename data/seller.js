import { sellers } from "../config/mongoCollections.js";
import { checkId } from "../utils/checks.js";

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

export const sellerDataFunctions = { getSellerById };
