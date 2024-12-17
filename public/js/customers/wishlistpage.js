/*
 * User Wishlist
 */

import { showErrorDialog } from "../helpers.js";

Array.from(document.getElementsByClassName("removeFromWishlistBtn")).forEach(
	(btn) =>
		btn.addEventListener("click", async (e) => {
			e.preventDefault();

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
					throw JSON.stringify(data.error);
				}
			} catch (e) {
				showErrorDialog(e);
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
				throw JSON.stringify(data.error);
			}
		} catch (e) {
			showErrorDialog(e);
		}
	})
);
