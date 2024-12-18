import { Router } from 'express';
const router = Router();
import { reviewsDataFunctions } from '../data/reviews.js';
import * as sellerDataFunctions from '../data/seller.js';
import * as validation from '../utils/checks.js';

router
  .route('/:listingId')
  .post(async (req, res) => {
    const user = req.session.user;
    let listingId = req.params.listingId;
    try {
      if (!user) throw `Session user not found. Login again.`;
    } catch (e) {
      return res.status(401).render('customerlogin', { error: e });
    }

    let reviewData = req.body;

    if (!reviewData || Object.keys(reviewData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }

    try {
      reviewData = validation.sanitizeObject(reviewData);
      let { rating, reviewText } = reviewData;
      rating = Number(rating);
      listingId = validation.checkId(listingId, 'Listing ID');
      rating = validation.checkIsPositiveInteger(rating);
      reviewText = validation.checkString(reviewText, 'Review Text');

      let newReview = await reviewsDataFunctions.createReview(
        user._id,
        user.username,
        listingId,
        rating,
        reviewText
      );

      return res.status(200).json({
        user: req.session.user,
      });
    } catch (e) {
      console.log(e);
      return res.status(404).json({ error: e });
    }
  })

  .delete(async (req, res) => {
    let { reviewId } = req.body;
    let listingId = req.params.listingId;
    reviewId = validation.sanitizeObject(reviewId);
    listingId = validation.checkId(listingId, 'Listing ID');

    try {
      await reviewsDataFunctions.deleteReview(reviewId);

      let listing = await reviewsDataFunctions.getListingReviews(listingId);

      return res.json(listing);
    } catch (e) {
      return res.status(404).render('error', { error: e });
    }
  })
  .put(async (req, res) => {
    const reviewData = req.body;
    if (!reviewData || Object.keys(reviewData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }
    try {
      // Validate review ID
      const listingId = validation.checkId(req.params.listingId, 'Listing ID');
      const sanitizedData = validation.sanitizeObject(reviewData);

      let { rating, reviewText, reviewId } = reviewData;

      rating = validation.checkIsPositiveInteger(rating);
      reviewText = validation.checkString(reviewText, 'Review Text');

      // Update the review
      const updatedReview = await reviewsDataFunctions.updateReview(
        reviewId,
        rating,
        reviewText
      );

      // Return the updated review
      return res
        .status(200)
        .json({ message: 'Review updated successfully', updatedReview });
    } catch (e) {
      console.error(e); // Log the error for debugging
      // Return a JSON error response
      return res.status(400).json({ error: e.toString() });
    }
  });

export default router;
