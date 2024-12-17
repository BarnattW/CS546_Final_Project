/*
 * Listing Form
 */

import { checkInputEmpty, showErrorDialog } from "../helpers.js";

// add to cart
const itemPageAddToCartForm = document.getElementById("itemAddToCart");
itemPageAddToCartForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		const listingId = document.getElementById("addToCartBtn").dataset.listingid;
		const quantity = document.getElementById(`quantity-${listingId}`);
		quantity.value = checkInputEmpty(quantity, "Quantity");
		if (quantity.value < 0) quantity.value = 1;
		else if (quantity.value > 5) quantity.value = 5;
		const response = await fetch("/customers/cart", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ listingId, quantity: quantity.value }),
		});

		if (response.ok) {
			window.location.href = "/customers/cart";
		} else {
			const data = await response.json();
			throw JSON.stringify(data.error);
		}
	} catch (e) {
		showErrorDialog(e);
	}
});

// add to wishlist
const addToWishlistBtn = document.getElementById("addToWishlistBtn");

addToWishlistBtn.addEventListener("click", async (e) => {
	e.preventDefault();

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
			throw JSON.stringify(data.error);
		}
	} catch (e) {
		showErrorDialog(e);
	}
});
