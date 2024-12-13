import { ObjectId } from 'mongodb';
import { listings, customers } from '../config/mongoCollections';
import * as validation from '../utils/checks.js';
import * as sellerDataFunctions from './seller';
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

const getReviewsById = async (customerId) => {
  //Validating Parameters
  customerId = validation.checkId(customerId, 'Customer ID');

  const listingCollection = await listings();
  const listingwithReview = await listingCollection.findOne(
    {
      customerId: new Object(customerId),
    },
    { projection: { reviews: 1 } }
  );

  if (!listingRiview) throw 'No reviews found for this customer.';

  return reviews[0];
};

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
