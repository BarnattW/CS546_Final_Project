import { checkInputEmpty, checkInputLength } from "./helpers.js";

/*
 * Listing Form
 */
// add to cart
// const itemPageAddToCartForm = document.getElementById("itemAddToCart");
// if (itemPageAddToCartForm) {
// 	itemPageAddToCartForm.addEventListener("submit", async (event) => {
// 		event.preventDefault();

// 		clientErrorDiv.hidden = true;
// 		clientErrorDiv.innerHTML = "";
// 		try {
// 			const listingId =
// 				document.getElementById("addToCartBtn").dataset.listingid;
// 			const quantity = document.getElementById(`quantity-${listingId}`);
// 			quantity.value = checkInputEmpty(quantity, "Quantity");
// 			if (quantity.value < 0) quantity.value = 1;
// 			else if (quantity.value > 5) quantity.value = 5;
// 			const response = await fetch("/customers/cart", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ listingId, quantity: quantity.value }),
// 			});

// 			if (response.ok) {
// 				window.location.href = "/customers/cart";
// 			} else {
// 				const data = await response.json();
// 				throw data.error;
// 			}
// 		} catch (e) {
// 			clientErrorDiv.hidden = false;
// 			clientErrorDiv.innerHTML = e;
// 		}
// 	});
// }

// add to wishlist
const addToWishlistBtn = document.getElementById("addToWishlistBtn");
if (addToWishlistBtn) {
	addToWishlistBtn.addEventListener("click", async (e) => {
		event.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";
		try {
			const listingId = addToWishlistBtn.dataset.listingid;
			if (!listingId) throw "listingId is missing";
			const response = await fetch("/customers/wishlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ listingId }),
			});

			if (response.ok) {
				window.location.href = "/customers/wishlist";
			} else {
				const data = await response.json();
				throw data.error;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	});
}

/*
 * User cart
 */
// Delete listing from cart
Array.from(document.getElementsByClassName("deleteCartItemBtn")).forEach(
	(btn) =>
		btn.addEventListener("click", async (e) => {
			e.preventDefault();

			const cartItemDiv = e.target.closest(".cart-item");
			const listingId = cartItemDiv.dataset.listingid;

			clientErrorDiv.hidden = true;
			clientErrorDiv.innerHTML = "";
			try {
				if (!cartItemDiv)
					throw "Cart item does not exist. Please refresh the page.";
			} catch (e) {
				clientErrorDiv.hidden = false;
				clientErrorDiv.innerHTML = e;
				return;
			}

			try {
				// Perform delete operation
				const response = await fetch(`/customers/cart`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						quantity: 0,
						listingId,
					}),
				});
				if (response.ok) {
					window.location.href = "/customers/cart";
				} else {
					throw `Could not remove listing with ID ${listingId} from cart. Please try again.`;
				}
			} catch (e) {
				clientErrorDiv.hidden = false;
				clientErrorDiv.innerHTML = e;
			}
		})
);

// update cart quantity
Array.from(document.getElementsByClassName("quantity-input")).forEach((input) =>
	input.addEventListener("change", async (e) => {
		e.preventDefault();

		const cartItemDiv = e.target.closest(".cart-item");
		const listingId = cartItemDiv.dataset.listingid;
		let quantity = parseInt(e.target.value, 10);

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";

		try {
			if (e.target.value > 5) {
				e.target.value = 5;
				throw `Quantity cannot be greater than 5`;
			}
			if (!cartItemDiv || !listingId) throw `No listingId found!`;
			if (!quantity) throw "No quantity found for item";
			if (isNaN(quantity) || quantity < 0)
				throw "Invalid quantity. Quantity must be a positive number";

			quantity = Math.min(quantity, 5);
			const response = await fetch(`/customers/cart`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					quantity,
					listingId,
				}),
			});

			if (response.ok) {
				window.location.href = "/customers/cart";
			} else {
				throw `Could not update listing with ID ${listingId}. Please try again.`;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	})
);

// Checks Reviews

const addReviewForm = document.getElementById("addReviewForm");
if (addReviewForm) {
	addReviewForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";

		try {
			const reviewText = document.getElementById("reviewText");
			const rating = document.getElementById("rating");
			reviewText.value = checkInputEmpty(reviewText, "Review Text");
			rating.value = checkInputEmpty(rating, "Rating");
			if (rating.value < 1 || rating.value > 5)
				throw `Rating must be between 1 and 5`;
			const response = await fetch(
				`/reviews/${addReviewForm.dataset.listingid}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
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
				throw data.error;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	});
}

/*
 * User Wishlist
 */

Array.from(document.getElementsByClassName("removeFromWishlistBtn")).forEach(
	(btn) =>
		btn.addEventListener("click", async (e) => {
			e.preventDefault();

			clientErrorDiv.hidden = true;
			clientErrorDiv.innerHTML = "";
			try {
				const listingId = e.target.dataset.listingid;
				if (!listingId) throw "listingId is missing";

				const response = await fetch("/customers/wishlist", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ listingId }),
				});

				if (response.ok) {
					window.location.href = "/customers/wishlist";
				} else {
					const data = await response.json();
					throw data.error;
				}
			} catch (e) {
				clientErrorDiv.hidden = false;
				clientErrorDiv.innerHTML = e;
				return;
			}
		})
);

Array.from(document.getElementsByClassName("moveToCartBtn")).forEach((btn) =>
	btn.addEventListener("click", async (e) => {
		e.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";
		try {
			const listingId = e.target.dataset.listingid;
			if (!listingId) throw "listingId is missing";

			const response = await fetch("/customers/moveWishlistToCart", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ listingId }),
			});

			if (response.ok) {
				window.location.href = "/customers/cart";
			} else {
				const data = await response.json();
				throw data.error;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	})
);

// Checks Comments

const addCommentForm = document.getElementById("addCommentForm");
if (addCommentForm) {
	addCommentForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";

		try {
			const commentText = document.getElementById("commentText");
			commentText.value = checkInputEmpty(commentText, "Comment Text");
			const response = await fetch(
				`/comments/${addCommentForm.dataset.listingid}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
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
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	});
}
