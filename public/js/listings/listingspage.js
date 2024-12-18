/*
 * Listing Form
 */

import { checkInputEmpty, showErrorDialog } from '../helpers.js';

// add to cart
const itemPageAddToCartForm = document.getElementById('itemAddToCart');
itemPageAddToCartForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const listingId = document.getElementById('addToCartBtn').dataset.listingid;
    const quantity = document.getElementById(`quantity-${listingId}`);
    quantity.value = checkInputEmpty(quantity, 'Quantity');
    if (quantity.value < 0) quantity.value = 1;
    else if (quantity.value > 5) quantity.value = 5;
    const response = await fetch('/customers/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listingId, quantity: quantity.value }),
    });

    if (response.ok) {
      window.location.href = '/customers/cart';
    } else {
      const data = await response.json();
      throw JSON.stringify(data.error);
    }
  } catch (e) {
    showErrorDialog(e);
  }
});

// add to wishlist
const addToWishlistBtn = document.getElementById('addToWishlistBtn');

addToWishlistBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    const listingId = addToWishlistBtn.dataset.listingid;
    if (!listingId) throw 'listingId is missing';
    const response = await fetch('/customers/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ listingId }),
    });

    if (response.ok) {
      window.location.href = '/customers/wishlist';
    } else {
      const data = await response.json();
      throw JSON.stringify(data.error);
    }
  } catch (e) {
    showErrorDialog(e);
  }
});

// Checks Reviews

const addReviewForm = document.getElementById('addReviewForm');
if (addReviewForm) {
  addReviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const reviewText = document.getElementById('reviewText');
      const rating = document.getElementById('rating');
      reviewText.value = checkInputEmpty(reviewText, 'Review Text');
      rating.value = checkInputEmpty(rating, 'Rating');
      if (rating.value < 1 || rating.value > 5)
        throw `Rating must be between 1 and 5`;
      const response = await fetch(
        `/reviews/${addReviewForm.dataset.listingid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reviewText: reviewText.value,
            rating: rating.value,
          }),
        }
      );

      if (response.ok) {
        location.reload();
      } else {
        const data = await response.json();
        throw JSON.stringify(data.error);
      }
    } catch (e) {
      showErrorDialog(e);
    }
  });
}

// Checks Comments

const addCommentForm = document.getElementById('addCommentForm');
if (addCommentForm) {
  addCommentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const commentText = document.getElementById('commentText');
      commentText.value = checkInputEmpty(commentText, 'Comment Text');
      const response = await fetch(
        `/comments/${addCommentForm.dataset.listingid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            commentText: commentText.value,
          }),
        }
      );

      if (response.ok) {
        location.reload();
      } else {
        const data = await response.json();
        throw data.error;
      }
    } catch (e) {
      showErrorDialog(e);
    }
  });
}

const editReviewForm = document.getElementById('editReviewForm');
if (editReviewForm)
  editReviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const reviewText = document.getElementById('editReviewText')?.value;
      const rating = document.getElementById('editRating')?.value;
      const reviewId = document.getElementById('editReviewId')?.value;
      const listingId = document.getElementById('editListingId')?.value;
      console.log(reviewText, rating, reviewId, listingId);
      if (rating.value < 1 || rating.value > 5)
        throw `Rating must be between 1 and 5`;
      const response = await fetch(`/reviews/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewText: reviewText,
          rating: Number(rating),
          reviewId: reviewId,
        }),
      });

      if (response.ok) {
        location.reload();
      } else {
        const data = await response.json();
        throw JSON.stringify(data.error);
      }
    } catch (e) {
      showErrorDialog(e);
    }
  });

const deleteReviewButton = document.getElementById('deleteReviewButton');
if (deleteReviewButton)
  deleteReviewButton.addEventListener('click', async (event) => {
    event.preventDefault();

    try {
      const reviewId = deleteReviewButton.dataset.reviewid;
      const listingId = deleteReviewButton.dataset.listingid;
      console.log(reviewId, listingId);
      const response = await fetch(`/reviews/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId: reviewId,
        }),
      });

      if (response.ok) {
        location.reload();
      } else {
        const data = await response.json();
        throw JSON.stringify(data.error);
      }
    } catch (e) {
      showErrorDialog(e);
    }
  });
