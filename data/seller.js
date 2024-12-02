import { sellers } from '../config/mongoCollections.js';
import * as validation from '../utils/checks.js';

const createSeller = async (username, password, name, town) => {
  username = validation.checkString(username); // Editing
};

/*
 * Returns a Seller from db given a Seller's id
 */
const getSellerById = async (id) => {
  id = validation.checkId(id);
  const sellersCollection = await sellers();
  const seller = await sellersCollection.findOne({ _id: new ObjectId(id) });
  if (!seller) throw 'Error: Seller not found';

  return seller;
};

const getAllListings = async () => {};

const getAllSellerListings = async (sellerId) => {};

const getSellerListing = async (listingId) => {};

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

const deleteListing = async (listingId) => {};

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
