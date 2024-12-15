import { ObjectId } from 'mongodb';
import { listings, customers } from '../config/mongoCollections.js';
import * as validation from '../utils/checks.js';
import * as sellerDataFunctions from './seller.js';
import { customerDataFunctions } from './customers.js';

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
  const updateInfoListing = await teamCollection.updateOne(
    { _id: new ObjectId(listingId) },
    {
      $set: {
        reviews: currListing.reviews,
      },
    }
  );

  if (!updateInfoListing.matchedCount && !updateInfoListing.modifiedCount)
    throw 'Update failed';

  // Grab the customer that the review is going under

  const currCustomer = await customerDataFunctions.getCustomerById(customerId);
  if (!currCustomer) throw 'Customer does not exist.';

  currCustomer.reviews.push(newReview);

  const customerCollection = await customers();
  const updateInfoCustomer = await customerCollection.updateOne(
    { _id: new ObjectId(customerId) },
    {
      $set: {
        reviews: currCustomer.reviews,
      },
    }
  );

  if (!updateInfoCustomer.matchedCount && !updateInfoCustomer.modifiedCount)
    throw 'Update failed';

  return (
    (await sellerDataFunctions.getListingById(listingId)) &&
    (await customerDataFunctions.getCustomerById(customerId))
  );
};

const getReviewsById = async (reviewId) => {
  // Should be working
  //Validating Parameters
  reviewId = validation.checkId(reviewId, 'Review ID');

  const listingCollection = await listings();
  const listingwithReview = await listingCollection.findOne(
    {
      'reviews._id': new ObjectId(reviewId),
    },
    { projection: { 'reviews.$': 1 } }
  );

  if (
    !listingwithReview ||
    listingwithReview.reviews.length === 0 ||
    !listingwithReview.reviews
  )
    throw 'No listing found for this review.';

  return reviews[0];
};

const getListingReviews = async (listingId) => {
  listingId = validation.checkId(listingId, 'Listing ID');

  const listing = await sellerDataFunctions.getListingById(listingId);
  if (!listing) throw 'Listing does not exist.';

  return listing.reviews;
};

const updateReview = async (reviewId, rating, reviewText) => {
  //validate parameters
  // go to collection and find which listing has the review
  // go to the collection and find which customer has the review????

  reviewId = validation.checkId(reviewId, 'Review ID');
  rating = validation.checkIsPositiveInteger(rating);
  reviewText = validation.checkString(reviewText, 'Review Text');

  const listingCollection = await listings();
  const updatedReview = await listingCollection.updateOne(
    { 'reviews._id': new ObjectId(reviewId) },
    {
      $set: {
        'reviews.$.rating': rating,
        'reviews.$.reviewText': reviewText,
      },
    }
  );

  if (!updatedReview.matchedCount && !updatedReview.modifiedCount)
    throw 'Update failed';

  return await getReviewsById(reviewId);
};

const deleteReview = async (reviewId) => {
  // Find the listing that has the review
  // Find the customer that wrote the review

  reviewId = validation.checkId(reviewId, 'Review ID');
  let listingCollection = await listings();
  let customerCollection = await customers();

  const review = await getReviewsById(reviewId);
  if (!review) throw 'Review does not exist.';
  const listingId = review.listingId.toString();
  const customerId = review.customerId.toString();

  const listing = await sellerDataFunctions.getListingById(listingId);
  if (!listing) throw 'Listing does not exist.';

  const customer = await customerDataFunctions.getCustomerById(customerId);
  if (!customer) throw 'Customer does not exist.';

  const updatedReviews = listing.reviews.filter(
    (review) => review._id.toString() !== reviewId
  );

  const updatedCustomerReviews = customer.reviews.filter(
    (review) => review._id.toString() !== reviewId
  );

  const updatedListing = await listingCollection.updateOne(
    { _id: new ObjectId(listingId) },
    {
      $set: {
        reviews: updatedReviews,
      },
    }
  );

  if (!updatedListing.matchedCount && !updatedListing.modifiedCount)
    throw 'Update failed';

  const updatedCustomer = await customerCollection.updateOne(
    { _id: new ObjectId(customerId) },
    {
      $set: {
        reviews: updatedCustomerReviews,
      },
    }
  );

  if (!updatedCustomer.matchedCount && !updatedCustomer.modifiedCount)
    throw 'Update failed';

  const finalListing = await sellerDataFunctions.getListingById(listingId);
  const finalCustomer = await customerDataFunctions.getCustomerById(customerId);
  return { listing: finalListing, customer: finalCustomer };
};

export const reviewDataFunctions = {
  getReviewsById,
  getListingReviews,
  createReview,
  updateReview,
  deleteReview,
};
