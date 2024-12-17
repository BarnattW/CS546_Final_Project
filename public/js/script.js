import { checkInputEmpty, checkInputLength } from "./helpers.js";

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
