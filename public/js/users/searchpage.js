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

const addToCartForm = document.getElementById("addToCart");
console.log(addToCartForm);

addToCartForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	clientErrorDiv.hidden = true;
	clientErrorDiv.innerHTML = "";
	try {
		const listingId = event.target.querySelector("input[name='listingId']");
		const quantity = event.target.querySelector("input[name='quantity']");
		listingId.value = checkInputEmpty(listingId, "listingId");
		quantity.value = checkInputEmpty(quantity, "Quantity");
		// const response = await fetch("/customers/cart", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		listingId: listingId.value,
		// 		quantity: quantity.value,
		// 	}),
		// });

		// if (response.ok) {
		// 	window.location.href = "/customers/cart";
		// } else {
		// 	const data = await response.json();
		// 	throw data.error;
		// }
	} catch (e) {
		clientErrorDiv.hidden = false;
		clientErrorDiv.innerHTML = e;
	}
});