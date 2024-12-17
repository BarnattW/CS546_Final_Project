import { checkInputEmpty, showErrorDialog } from "../helpers.js";
/*
 * Search bar and search results page
 */

const searchForm = document.getElementById("searchForm");

if (searchForm) {
	searchForm.addEventListener("submit", (event) => {
		event.preventDefault();

		searchForm.submit();
	});
}

Array.from(document.getElementsByClassName("addToCart")).forEach((form) => {
	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		try {
			const listingId = event.target.querySelector("input[name='listingId']");
			const quantity = event.target.querySelector("input[name='quantity']");
			listingId.value = checkInputEmpty(listingId, "listingId");
			quantity.value = checkInputEmpty(quantity, "Quantity");
			if (quantity.value < 0) quantity.value = 1;
			else if (quantity.value > 5) quantity.value = 5;
			const response = await fetch("/customers/cart", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					listingId: listingId.value,
					quantity: quantity.value,
				}),
			});

			if (response.ok) {
				window.location.href = "/customers/cart";
			} else {
				const data = await response.json();
				throw data.error;
			}
		} catch (e) {
			showErrorDialog(e);
		}
	});
});
