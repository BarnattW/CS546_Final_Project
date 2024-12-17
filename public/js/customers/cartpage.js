/*
 * User cart
 */

import { showErrorDialog } from "../helpers.js";

// Delete listing from cart
Array.from(document.getElementsByClassName("deleteCartItemBtn")).forEach(
	(btn) =>
		btn.addEventListener("click", async (e) => {
			e.preventDefault();

			const cartItemDiv = e.target.closest(".cart-item");
			const listingId = cartItemDiv.dataset.listingid;

			try {
				if (!cartItemDiv)
					throw "Cart item does not exist. Please refresh the page.";
				if (!listingId) throw "No listing ID found for item";

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
					window.location.reload();
				} else {
					const data = await response.json();
					throw JSON.stringify(data.error);
				}
			} catch (e) {
				showErrorDialog(e);
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

		try {
			if (e.target.value > 5) {
				e.target.value = 5;
				throw `Quantity cannot be greater than 5`;
			} else if (e.target.value < 1) {
				e.target.value = 1;
				throw `Quantity cannot be less than 1`;
			}

			if (!cartItemDiv || !listingId) throw `No listingId found!`;
			if (!quantity) throw "No quantity found for item";
			if (isNaN(quantity) || quantity < 1)
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
				window.location.reload();
			} else {
				const data = await response.json();
				throw JSON.stringify(data.error);
			}
		} catch (e) {
			showErrorDialog(e);
		}
	})
);
