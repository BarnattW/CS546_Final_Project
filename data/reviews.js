import { ObjectId } from 'mongodb';
import { listings } from '../config/mongoCollections';
import * as validation from '../utils/checks.js';
import { sellerDataFunctions } from './seller';

const createReview = async (
  customerId,
  customerName,
  listingId,
  rating,
  reviewText
) => {
  //Validating Parameters

  customerId = validation.checkId(customerId, 'Customer ID');
  customerName = validation.checkString(customerName, 'Customer Name');
  listingId = validation.checkId(listingId, 'Listing ID');
  rating = validation.checkIsPositiveInteger(rating);
  if (rating > 5) throw 'Rating is out of 5 stars!';
  reviewText = validation.checkString(reviewText, 'Review Text');

  // Creates a new Object of Review
  let newReview = {
    customerId,
    customerName,
    listingId,
    rating,
    reviewText,
  };

  // Grab the listing that the review is going under
  const currListing = await sellerDataFunctions.getListingById(listingId);
  if (!currListing) throw 'Listing does not exist.';

  currListing.reviews.push(newReview);

  const listingCollection = await listings();
  const updateInfo = await teamCollection.updateOne(
    { _id: new ObjectId(listingId) },
    {
      $set: {
        reviews: currListing.reviews,
      },
    }
  );
};

const getReviewsById = async (customerId) => {};

const getListingReviews = async (listingId) => {};

const updateReview = async (reviewId, rating, reviewText) => {};

const deleteReview = async (reviewId) => {};

export {
  getReviewsById,
  getListingReviews,
  createReview,
  updateReview,
  deleteReview,
};
