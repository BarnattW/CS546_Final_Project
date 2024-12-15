import { ObjectId } from 'mongodb';
import * as validation from '../utils/checks.js';
import { listings } from '../config/mongoCollections.js';

export const searchListing = async (searchQuery) => {
  searchQuery = validation.checkString(searchQuery, 'Search Query');

  const listingCollection = await listings();

  const searchResults = await listingCollection
    .find({
      $text: { $search: searchQuery },
    })
    .toArray();

  return searchResults;
};
