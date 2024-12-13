import { sellers } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { listings } from '../config/mongoCollections.js';
import * as validation from '../utils/checks.js';
import bcrypt from 'bcrypt';
import uploadImage from '../utils/imageUpload.js';

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

  if (!seller) throw 'Invalid UserName or Password';

  const comparePassword = await bcrypt.compare(password, seller.password);

  if (!comparePassword) throw 'Invalid UserName or Password';

  return { username: seller.username, _id: seller._id.toString() };
};

// Creates a new Seller and returns it.

export const createSeller = async (username, password, businessName, town) => {
  // Validating Parameters
  username = validation.checkString(username);
  password = validation.checkString(password);
  businessName = validation.checkString(businessName);
  town = validation.checkString(town);

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  let newSeller = {
    username,
    password: hashedPassword,
    businessName,
    town,
    listing: [],
    orders: [],
  };

  const sellerCollection = await sellers();
  const existingUser = await sellerCollection.findOne({ username });
  if (existingUser) throw 'There is already a seller with that username';

  const insertInfo = await sellerCollection.insertOne(newSeller);

  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add seller.';

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
  if (!sellerList) throw 'Can not get all Sellers.';
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
  if (!seller) throw 'Error: Seller not found';

  return seller;
};

// Returns a specific seller's listings array (seller.listing is an array of references aka a listing id)

export const getAllSellerListings = async (sellerId) => {
  sellerId = validation.checkId(sellerId);

  const currSeller = await getSellerById(sellerId);
  if (!currSeller) throw 'Error: No seller found with the given sellerId.';

  let currSellerListings = currSeller.listing;

  currSellerListings = currSellerListings.map((element) => {
    element = getListingById(element);
    return element;
  });

  return currSellerListings;
};

// Returns a specific seller's

export const getListingById = async (listingId) => {
  listingId = validation.checkId(listingId, 'Listing ID');
  const listingCollection = await listings();
  const listing = await listingCollection.findOne({
    _id: new ObjectId(listingId),
  });

  if (!listing) throw 'Can not find listing from that listingId.';
  listing._id = listing._id.toString();
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
  sellerId = validation.checkId(sellerId, 'Seller ID');
  itemName = validation.checkString(itemName, 'Item Name');
  itemDescription = validation.checkString(itemDescription, 'Item Description');
  itemPrice = validation.checkIsPositiveInteger(itemPrice);
  itemImage = validation.checkString(itemImage, 'Item Image');
  itemCategory = validation.checkString(itemCategory, 'Item Catagory');
  condition = validation.checkString(condition, 'Condition');

  itemImage = uploadImage(itemImage); // returns the image url

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
    throw 'Could not add listing.';

  const newId = insertInfo.insertedId.toString();
  const listing = await getListingById(newId);
  return listing;
};

// Returns all listing furniture with (ID and NAME)

export const getAllListings = async () => {
  const listingCollection = await listings();
  let listingList = await listingCollection
    .find({})
    .project({ _id: 1, name: 1 })
    .toArray();
  if (!listingList) throw 'Could not get all listings.';
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
  listingId = validation.checkId(listingId, 'Listing ID');
  itemName = validation.checkString(itemName, 'Item Name');
  itemDescription = validation.checkString(itemDescription, 'Item Description');
  itemPrice = validation.checkIsPositiveInteger(itemPrice);
  itemImage = validation.checkString(itemImage, 'Item Image');
  itemCategory = validation.checkString(itemCategory, 'Item Catagory');
  condition = validation.checkString(condition, 'Condition');

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
    { returnDocument: 'after' }
  );

  if (!updatedInfo) throw 'Could not update listing.';

  updatedInfo._id = updatedInfo._id.toString();

  return updatedInfo;
};

// Deletes a listing from the listing collection

export const deleteListing = async (listingId) => {
  listingId = validation.checkId(listingId, 'Listing ID');
  const listingCollection = await listings();
  const deletionInfo = await listingCollection.findOneAndDelete({
    _id: new ObjectId(listingId),
  });
  if (!deletionInfo) throw `Could not delete listing with id:${listingId}`;

  return `${deletionInfo.name} have been successfully deleted!`;
};

/*
 * The one below is a doozy
 */
const searchForListing = async (queryParams) => {};
