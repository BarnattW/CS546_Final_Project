import { Router } from 'express';
const router = Router();
import { reviewDataFunctions } from '../data/reviews.js';
import * as sellerDataFunctions from '../data/seller.js';
import * as validation from '../utils/checks.js';
import { customersDataFunctions } from '../data/customers.js';

router
  .route('/:listingId')
  .get(async (req, res) => {
    try {
      req.params.listingId = validation.checkId(
        req.params.listingId,
        'listing ID'
      );
    } catch (e) {
      return res.status(400).render('error', { error: e });
    }

    try {
      let listingId = req.params.listingId;
      let reviews = await reviewDataFunctions.getListingReviews(listingId);
      let listing = await sellerDataFunctions.getListingById(listingId);

      return res.render('listing', {
        reviews,
        user: req.session.user,
        listing,
      });
    } catch (e) {
      console.log(e);
      return res.status(404).json({ error: e });
    }
  })
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

      let newReview = await reviewDataFunctions.createReview(
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
    try {
      req.params.reviewId = validation.checkId(
        req.params.reviewId,
        'Review ID'
      );
    } catch (e) {
      return res.status(400).render('error', { error: e });
    }

    try {
      let reviewId = req.params.reviewId;
      await reviewDataFunctions.deleteReview(reviewId);

      reviews = await reviewDataFunctions.getListingReviews(reviewId.listingId);

      return res.render('reviews', { reviews });
    } catch (e) {
      return res.status(404).render('error', { error: e });
    }
  })
  .put(async (req, res) => {
    try {
      req.params.reviewId = validation.checkId(
        req.params.reviewId,
        'Review ID'
      );
    } catch (e) {
      return res.status(400).render('error', { error: e });
    }

    reviewData = req.body;
    if (!reviewData || Object.keys(reviewData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }

    try {
      reviewData = sanitizeObject(reviewData);
      const { rating, reviewText } = reviewData;

      rating = validation.checkIsPositiveInteger(rating);
      reviewText = validation.checkString(reviewText, 'Review Text');
    } catch (e) {
      return res.status(404).json('error', { error: e });
    }

    try {
      let reviewId = req.params.reviewId;
      let review = await reviewDataFunctions.updateReview(
        reviewId,
        rating,
        reviewText
      );

      return res.render('reviews', { user: req.session.user, review });
    } catch (e) {
      return res.status(404).json('error', { error: e });
    }
  });

export default router;
