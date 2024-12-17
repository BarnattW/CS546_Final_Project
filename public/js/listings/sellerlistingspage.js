/*
 * Seller listings Page
 */

import { checkInputEmpty, checkNumRange, convertImage } from "../helpers.js";

// Add Listings form
const addListingForm = document.getElementById("addListingForm");

const listingName = document.getElementById("listingName");
const listingDescription = document.getElementById("listingDescription");
const listingPrice = document.getElementById("listingPrice");
const listingCategory = document.getElementById("listingSubcategory");
const listingCondition = document.getElementById("listingCondition");
const listingImage = document.getElementById("listingImage");

const clientErrorDiv = document.getElementById("clientError");
const addListingError = document.getElementById("addListingError");

addListingForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	addListingError.hidden = true;
	addListingError.innerHTML = "";
	try {
		listingName.value = checkInputEmpty(listingName, "Listing Name");
		listingDescription.value = checkInputEmpty(
			listingDescription,
			"Listing Description"
		);
		listingPrice.value = checkInputEmpty(listingPrice, "Listing Price");
		listingCategory.value = checkInputEmpty(
			listingCategory,
			"Listing Category"
		);
		listingCondition.value = checkInputEmpty(
			listingCondition,
			"Listing Condition"
		);

		if (!listingImage.files) throw `An image is required`;
	} catch (e) {
		addListingError.hidden = false;
		addListingError.innerHTML = e;
		return;
	}

	try {
		const image = await convertImage(listingImage.files[0]);
		const price = Number(listingPrice.value);
		checkNumRange(price, 1, 10000);
		const response = await fetch("/sellers/addlisting", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				itemName: listingName.value,
				itemDescription: listingDescription.value,
				itemPrice: price,
				itemImage: image,
				itemCategory: listingCategory.value,
				condition: listingCondition.value,
			}),
		});

		if (!response.ok) {
			const data = await response.json();
			throw data.error;
		} else {
			window.location.reload();
		}
	} catch (e) {
		clientErrorDiv.hidden = false;
		clientErrorDiv.innerHTML = e;
	}
});

// Delete listing
Array.from(document.getElementsByClassName("deleteListingBtn")).forEach((btn) =>
	btn.addEventListener("click", async (e) => {
		const row = e.target.closest("tr");
		const listingId = row.dataset.listingid;

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";
		try {
			const response = await fetch(`/sellers/listings/${listingId}`, {
				method: "DELETE",
			});
			if (response.ok) {
				window.location.reload();
			} else {
				throw `Could not delete listing with ID ${listingId}`;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	})
);

// Modals
const createListingModal = document.getElementById("createListingModal");
const openCreateListingBtn = document.getElementById("openCreateListingBtn");
const closeCreateListingBtn = document.getElementById("closeCreateListingBtn");

openCreateListingBtn.addEventListener("click", () => {
	addListingForm.reset();

	createListingModal.classList.remove("hidden");
	createListingModal.classList.add("flex");
});

closeCreateListingBtn.addEventListener("click", () => {
	createListingModal.classList.add("hidden");
});

// Edit Listing

const editListingModal = document.getElementById("editListingModal");
const closeEditListingBtn = document.getElementById("closeEditListingBtn");

Array.from(document.getElementsByClassName("editListingBtn")).forEach((btn) =>
	btn.addEventListener("click", (e) => {
		e.preventDefault();
		// open modal
		editListingModal.classList.remove("hidden");
		editListingModal.classList.add("flex");

		const row = e.target.closest("tr");
		const listingId = row.dataset.listingid;
		// add hidden listingId
		document.getElementById("editListingForm").dataset.listingid = listingId;

		const itemName = row.querySelector("td:nth-child(2)").innerText;
		const itemDescription = row.querySelector("td:nth-child(3)").innerText;
		const itemPrice = row
			.querySelector("td:nth-child(6)")
			.innerText.replace("$", "");
		const itemCategory = row.querySelector("td:nth-child(4)").innerText;
		const itemCondition = row.querySelector("td:nth-child(5)").innerText;

		document.getElementById("editListingName").value = itemName;
		document.getElementById("editListingDescription").value = itemDescription;
		document.getElementById("editListingPrice").value =
			parseFloat(itemPrice).toFixed(2);
		document.getElementById("editListingCategory").value = itemCategory;
		document.getElementById("editListingCondition").value = itemCondition;
	})
);

closeEditListingBtn.addEventListener("click", () => {
	editListingModal.classList.add("hidden");
});

const editListingForm = document.getElementById("editListingForm");
const editListingError = document.getElementById("editListingError");

editListingForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	editListingError.hidden = true;
	editListingError.innerHTML = "";
	try {
		const listingId = editListingForm.dataset.listingid;
		const listingName = document.getElementById("editListingName");
		const listingDescription = document.getElementById(
			"editListingDescription"
		);
		const listingPrice = document.getElementById("editListingPrice");
		const listingCategory = document.getElementById("editListingCategory");
		const listingCondition = document.getElementById("editListingCondition");

		if (!listingId) throw `Listing ID not found`;
		listingName.value = checkInputEmpty(listingName, "Listing Name");
		listingDescription.value = checkInputEmpty(
			listingDescription,
			"Listing Description"
		);
		listingPrice.value = checkInputEmpty(listingPrice, "Listing Price");
		const price = Number(listingPrice.value);
		checkNumRange(price, 1, 10000);
		listingCategory.value = checkInputEmpty(
			listingCategory,
			"Listing Category"
		);
		listingCondition.value = checkInputEmpty(
			listingCondition,
			"Listing Condition"
		);

		let image;
		// get image url
		if (editListingImage.files.length === 0) {
			const row = document.querySelector(`tr[data-listingid="${listingId}"]`);
			image = row.querySelector("td:nth-child(1) img").src;
		} else image = await convertImage(editListingImage.files[0]);
		const response = await fetch(`/sellers/listings/${listingId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				itemName: listingName.value,
				itemDescription: listingDescription.value,
				itemPrice: price,
				itemImage: image,
				itemCategory: listingCategory.value,
				condition: listingCondition.value,
			}),
		});

		if (!response.ok) {
			const data = await response.json();
			throw data.error;
		} else {
			window.location.reload();
		}
	} catch (e) {
		editListingError.hidden = false;
		editListingError.innerHTML = e;
	}
});
