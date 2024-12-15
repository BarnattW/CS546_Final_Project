import { ObjectId } from 'mongodb';
import * as validation from '../utils/checks.js';
import { listings } from '../config/mongoCollections.js';
import * as sellerDataFunctions from './seller.js';

export const searchListing = async (searchQuery) => {
  const listingCollection = await listings();

  if (!searchQuery || searchQuery.trim().length === 0) {
    return await sellerDataFunctions.getAllListings();
  }

  // Directly use `$regex` and `$options`
  const searchResults = await listingCollection
    .find({
      $or: [
        { itemName: { $regex: searchQuery, $options: 'i' } },
        { itemDescription: { $regex: searchQuery, $options: 'i' } },
        { itemCategory: { $regex: searchQuery, $options: 'i' } },
      ],
    })
    .toArray();

  return searchResults;
};
