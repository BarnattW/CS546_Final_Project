const getCustomerReviews = async (customerId) => {};

const getListingReviews = async (listingId) => {};

const createReview = async (
	customerId,
	customerName,
	listingId,
	rating,
	reviewText
) => {};

const updateReview = async (reviewId, rating, reviewText) => {};

const deleteReview = async (reviewId) => {};

export {
	getCustomerReviews,
	getListingReviews,
	createReview,
	updateReview,
	deleteReview,
};
