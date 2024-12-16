/*
 * Helpers
 */
const checkInputEmpty = (elementId, inputName) => {
	if (!elementId.value.trim()) throw `${inputName} cannot be empty`;
	return elementId.value.trim();
};

const checkInputLength = (elementId, inputName, min, max) => {
	const str = elementId.value;
	if (max == undefined && str.length < min) {
		throw `${inputName} should be greater than ${min} characters long`;
	}
	if (str.length < min || str.length > max)
		throw `${inputName} should be between ${min}-${max} characters long`;
};

const convertImage = (image) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = () => resolve(fileReader.result);
		fileReader.onerror = (error) => reject(error);
		fileReader.readAsDataURL(image);
	});
};

/*
 * Signup Page
 */
let signupTabs = document.getElementsByClassName("signupTab");
let signupForms = document.getElementsByClassName("signupForm");

if (signupTabs && signupForms) {
	signupTabs = Array.from(signupTabs);
	signupForms = Array.from(signupForms);
	signupTabs.forEach((signupTab) => {
		signupTab.addEventListener("click", () => {
			signupTabs.forEach((tab) => {
				tab.classList.remove("active");
			});
			signupForms.forEach((form) => {
				form.classList.add("hidden");
			});

			signupTab.classList.add("active");
			const form = signupTab.getAttribute("data-tab");
			document.getElementById(form).classList.remove("hidden");
		});
	});
}

/*
 * Signin Page
 */
let signinTabs = document.getElementsByClassName("signinTab");
let signinForms = document.getElementsByClassName("signinForm");

if (signinTabs && signinForms) {
	signinTabs = Array.from(signinTabs);
	signinForms = Array.from(signinForms);
	signinTabs.forEach((signinTab) => {
		signinTab.addEventListener("click", () => {
			signinTabs.forEach((tab) => {
				tab.classList.remove("active");
			});
			signinForms.forEach((form) => {
				form.classList.add("hidden");
			});

			signinTab.classList.add("active");
			const form = signinTab.getAttribute("data-tab");
			document.getElementById(form).classList.remove("hidden");
		});
	});
}

// Form Submission
const clientErrorDiv = document.getElementById("clientError");

const customerSignupForm = document.getElementById("customerSignup");
const customerSignupSubmit = document.getElementById("customerSignupSubmit");
const sellerSignupForm = document.getElementById("sellerSignup");
const sellerSignupSubmit = document.getElementById("sellerSignupSubmit");

const customerName = document.getElementById("customerName");
const customerUsername = document.getElementById("customerUsername");
const customerPassword = document.getElementById("customerPassword");
const customerConfirmPassword = document.getElementById(
	"customerConfirmPassword"
);

const sellerBusinessName = document.getElementById("sellerBusinessName");
const sellerTown = document.getElementById("sellerTown");
const sellerUsername = document.getElementById("sellerUsername");
const sellerPassword = document.getElementById("sellerPassword");
const sellerConfirmPassword = document.getElementById("sellerConfirmPassword");

if (customerSignupForm) {
	customerSignupForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";
		try {
			customerName.value = checkInputEmpty(customerName, "Name");
			customerUsername.value = checkInputEmpty(customerUsername, "Username");
			customerPassword.value = checkInputEmpty(customerPassword, "Password");
			customerConfirmPassword.value = checkInputEmpty(
				customerConfirmPassword,
				"Confirmation Password"
			);
			checkInputLength(customerUsername, "Username", 5, 20);
			checkInputLength(customerPassword, "Password", 8);
			checkInputLength(customerConfirmPassword, "Confirmation Password", 8);

			if (customerPassword.value != customerConfirmPassword.value)
				throw `Password and confirmation password must match`;
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
			return;
		}

		try {
			const response = await fetch("/customers/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: customerUsername.value,
					name: customerName.value,
					password: customerPassword.value,
					confirmPassword: customerConfirmPassword.value,
				}),
			});

			if (response.ok) {
				window.location.href = "/customers/login";
			} else {
				const data = await response.json();
				clientErrorDiv.hidden = false;
				clientErrorDiv.innerHTML = data.error;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	});
}

if (sellerSignupForm) {
	sellerSignupForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";
		try {
			sellerBusinessName.value = checkInputEmpty(
				sellerBusinessName,
				"Business Name"
			);
			sellerTown.value = checkInputEmpty(sellerTown, "Town");
			sellerUsername.value = checkInputEmpty(sellerUsername, "Username");
			sellerPassword.value = checkInputEmpty(sellerPassword, "Password");
			sellerConfirmPassword.value = checkInputEmpty(
				sellerConfirmPassword,
				"Confirmation Password"
			);
			checkInputLength(sellerUsername, "Username", 5, 30);
			checkInputLength(sellerPassword, "Password", 8);
			checkInputLength(sellerConfirmPassword, "Confirmation Password", 8);

			if (sellerPassword.value != sellerConfirmPassword.value)
				throw `Password and confirmation password must match`;
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
			return;
		}

		try {
			const response = await fetch("/sellers/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					businessName: sellerBusinessName.value,
					town: sellerTown.value,
					username: sellerUsername.value,
					password: sellerPassword.value,
					confirmPassword: sellerConfirmPassword.value,
				}),
			});

			if (response.ok) {
				window.location.href = "/sellers/login";
			} else {
				const data = await response.json();
				clientErrorDiv.hidden = false;
				clientErrorDiv.innerHTML = data.error;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	});
}

/*
 * Login Pages
 */

const customerLoginForm = document.getElementById("customerLogin");
const customerLoginSubmit = document.getElementById("customerLoginSubmit");

const sellerLoginForm = document.getElementById("sellerLogin");

if (customerLoginForm) {
	customerLoginForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";
		try {
			customerUsername.value = checkInputEmpty(customerUsername, "Username");
			customerPassword.value = checkInputEmpty(customerPassword, "Password");
			checkInputLength(customerUsername, "Username", 5, 20);
			checkInputLength(customerPassword, "Password", 8);
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
			return;
		}

		try {
			const response = await fetch("/customers/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: customerUsername.value,
					password: customerPassword.value,
				}),
			});

			if (response.ok) {
				window.location.href = "/";
			} else {
				const data = await response.json();
				clientErrorDiv.hidden = false;
				clientErrorDiv.innerHTML = data.error;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	});
}

if (sellerLoginForm) {
	sellerLoginForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";
		try {
			sellerUsername.value = checkInputEmpty(sellerUsername, "Username");
			sellerPassword.value = checkInputEmpty(sellerPassword, "Password");
			checkInputLength(sellerUsername, "Username", 5, 20);
			checkInputLength(sellerPassword, "Password", 8);
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
			return;
		}

		try {
			const response = await fetch("/sellers/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: sellerUsername.value,
					password: sellerPassword.value,
				}),
			});

			if (response.ok) {
				window.location.href = "/";
			} else {
				const data = await response.json();
				clientErrorDiv.hidden = false;
				clientErrorDiv.innerHTML = data.error;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	});
}

/*
 * Seller listings Page
 */

const createListingModal = document.getElementById("createListingModal");
const form = document.getElementById("listing-form");
const openCreateListingBtn = document.getElementById("openCreateListingBtn");
const closeCreateListingBtn = document.getElementById("closeCreateListingBtn");

if (openCreateListingBtn) {
	openCreateListingBtn.addEventListener("click", () => {
		//form.reset();
		createListingModal.classList.remove("hidden");
		createListingModal.classList.add("flex");
	});
}

if (closeCreateListingBtn) {
	closeCreateListingBtn.addEventListener("click", () => {
		createListingModal.classList.add("hidden");
	});
}

// Add Listings form
const addListingForm = document.getElementById("addListingForm");

const listingName = document.getElementById("listingName");
const listingDescription = document.getElementById("listingDescription");
const listingPrice = document.getElementById("listingPrice");
const listingCategory = document.getElementById("listingSubcategory");
const listingCondition = document.getElementById("listingCondition");
const listingImage = document.getElementById("listingImage");

if (addListingForm) {
	addListingForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";
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
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
			return;
		}

		try {
			const image = await convertImage(listingImage.files[0]);
			const price = Number(listingPrice.value);
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
				window.location.href = "/sellers/listings";
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	});
}

document.querySelectorAll("editListingBtn").forEach((btn) =>
	btn.addEventListener("click", (e) => {
		const row = e.target.closest("tr");

		// Prefill form with listing data
		document.getElementById("listing-id").value = listingId;
		document.getElementById("itemName").value =
			row.querySelector("td:nth-child(2)").innerText;
		document.getElementById("itemImage").value = row.querySelector("img").src;
		document.getElementById("itemDescription").value =
			row.querySelector("td:nth-child(3)").innerText;
		document.getElementById("itemPrice").value = row
			.querySelector("td:nth-child(4)")
			.innerText.replace("$", "");

		// Update the modal title and show the modal
		document.getElementById("modal-title").innerText = "Edit Listing";
		document.getElementById("modal").classList.remove("hidden");
	})
);

// Delete listing
Array.from(document.getElementsByClassName("deleteListingBtn")).forEach((btn) =>
	btn.addEventListener("click", async (e) => {
		const row = e.target.closest("tr");
		const listingId = row.dataset.listingid;

		try {
			// Perform delete operation
			const response = await fetch(`/sellers/listings/${listingId}`, {
				method: "DELETE",
			});
			if (response.ok) {
				window.location.href = "/sellers/listings";
			} else {
				throw `Could not delete listing with ID ${listingId}`;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	})
);

/*
 * Search bar and search results
 */

const searchForm = document.getElementById("searchForm");

if (searchForm) {
	searchForm.addEventListener("submit", (event) => {
		event.preventDefault();

		searchForm.submit();
	});
}

const addToCartForm = document.getElementById("addToCart");
if (addToCartForm) {
	addToCartForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";
		try {
			const listingId = event.target.querySelector("input[name='listingId']");
			const quantity = event.target.querySelector("input[name='quantity']");
			listingId.value = checkInputEmpty(listingId, "listingId");
			quantity.value = checkInputEmpty(quantity, "Quantity");
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
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	});
}

/*
 * Listing Form
 */
// add to cart
const itemPageAddToCartForm = document.getElementById("itemAddToCart");
if (itemPageAddToCartForm) {
	itemPageAddToCartForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		clientErrorDiv.hidden = true;
		clientErrorDiv.innerHTML = "";
		try {
			const listingId =
				document.getElementById("addToCartBtn").dataset.listingid;
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
				throw data.error;
			}
		} catch (e) {
			clientErrorDiv.hidden = false;
			clientErrorDiv.innerHTML = e;
		}
	});
}

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
<<<<<<< HEAD
<<<<<<< HEAD

// let slideIndex = 0;
// showSlides();

// function showSlides() {
// 	let i;
// 	let slides = document.getElementsByClassName("mySlides");
// 	let dots = document.getElementsByClassName("dot");
// 	for (i = 0; i < slides.length; i++) {
// 		slides[i].style.display = "none";
// 	}

// 	slideIndex++;
// 	if (slideIndex > slides.length) {
// 		slideIndex = 1;
// 	}
// 	for (i = 0; i < dots.length; i++) {
// 		dots[i].className = dots[i].className.replace(" active", "");
// 	}
// 	slides[slideIndex - 1].style.display = "block";
// 	dots[slideIndex - 1].className += " active";
// 	setTimeout(showSlides, 2000);
// }
=======
>>>>>>> parent of ffb3f2f (homepage pictures/orders route)
=======
>>>>>>> parent of ffb3f2f (homepage pictures/orders route)
