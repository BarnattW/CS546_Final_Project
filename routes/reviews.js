import { Router } from 'express';
const router = Router();
import { reviewDataFunctions } from '../data/reviews.js';
import * as sellerDataFunctions from '../data/seller.js';
import { customerDataFunctions } from '../data/customers.js';

import * as validation from '../utils/checks.js';

router
  .route('/:reviewId')
  .get(async (req, res) => {
    try {
      req.params.listingId = validation.checkId(
        req.params.reviewId,
        'Review ID'
      );
    } catch (e) {
      return res.status(400).render('error', { message: e });
    }

    try {
      let reviewId = req.params.reviewId;
      let review = await reviewDataFunctions.getReviewsById(reviewId);

      return res.render('reviews', { review });
    } catch (e) {
      return res.status(404).json('error', { message: e });
    }
  })
  .post(async (req, res) => {
    const user = req.session.user;
    try {
      if (!user) throw `Session user not found. Login again.`;
    } catch (e) {
      return res.status(401).render('customerlogin', { message: e });
    }

    const reviewData = req.body;

    if (!reviewData || Object.keys(reviewData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }

    try {
      reviewData = sanitizeObject(reviewData);

      const { listingId, rating, reviewText } = reviewData;

      listingId = validation.checkId(listingId, 'Listing ID');
      rating = validation.checkIsPositiveInteger(rating);
      reviewText = validation.checkString(reviewText, 'Review Text');
    } catch (e) {
      return res.status(404).json('error', { message: e });
    }

    try {
      const customer = await customerDataFunctions.getCustomerById(
        req.session.user._id
      );
      const name = customer.name;

      let newReview = await reviewDataFunctions.createReview(
        req.session.user._id,
        name,
        listingId,
        rating,
        reviewText
      );

      return res.render('reviews', { user: req.session.user, newReview });
    } catch (e) {
      return res.status(404).json('error', { message: e });
    }
  })

  .delete(async (req, res) => {
    try {
      req.params.reviewId = validation.checkId(
        req.params.reviewId,
        'Review ID'
      );
    } catch (e) {
      return res.status(400).render('error', { message: e });
    }

    try {
      let reviewId = req.params.reviewId;
      let review = await reviewDataFunctions.deleteReview(reviewId);

      return res.render('reviews', { review });
    } catch (e) {
      return res.status(404).render('error', { message: e });
    }
  })
  .put(async (req, res) => {
    try {
      req.params.reviewId = validation.checkId(
        req.params.reviewId,
        'Review ID'
      );
    } catch (e) {
      return res.status(400).render('error', { message: e });
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
      return res.status(404).json('error', { message: e });
    }

    try {
      let reviewId = req.params.reviewId;
      let review = await reviewDataFunctions.updateReview(reviewId);

      return res.render('reviews', { user: req.session.user, review });
    } catch (e) {
      return res.status(404).json('error', { message: e });
    }
  });

export default router;
