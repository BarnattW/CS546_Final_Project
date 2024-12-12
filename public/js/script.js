/*
 * Helpers
 */
let checkInputEmpty = (elementId, inputName) => {
	if (!elementId.value.trim()) throw `${inputName} cannot be empty`;
	return elementId.value.trim();
};

let checkInputLength = (elementId, inputName, min, max) => {
	const str = elementId.value;
	if (max == undefined && str.length < min) {
		throw `${inputName} should be greater than ${min} characters long`;
	}
	if (str.length < min || str.length > max)
		throw `${inputName} should be between ${min}-${max} characters long`;
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

// listings (customer view)
const searchForm = document.getElementById("searchForm");

const listingsContainer = document.querySelector(".listing-item");

const fetchListings = async () => {
	try {
		const response = await fetch("/api/listings");
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		const listings = await response.json();
		return listings;
	} catch (error) {
		console.error("Failed to fetch listings:", error);
		return [];
	}
};

const createListingElement = (listing) => {
	return `<div class="listing-item">
			<img class="listing-image" src="${listing.itemImage}" alt="${listing.itemName}" />
			<h2>${listing.itemName}</h2>
			<p>${listing.itemDescription}</p>
			<p>Price: $${listing.itemPrice}</p>
			<p>Category: ${listing.itemCategory}</p>
			<p>Condition: ${listing.condition}</p>
			<p>Seller ID: ${listing.sellerId}</p>
			<button class="btn-add-to-cart">Add to Cart</button>
		</div>
	`;
};

document
	.getElementById("listingsContainer")
	.addEventListener("click", (event) => {
		if (event.target && event.target.classList.contains("btn-add-to-cart")) {
			const listingName = event.target
				.closest(".listing-item")
				.querySelector("h2").textContent;
			console.log(`Added ${listingName} to cart.`);
		}
	});

const renderListings = async () => {
	const listings = await fetchListings();
	listings.forEach((listing) => {
		const listingElement = createListingElement(listing);
		listingsContainer.appendChild(listingElement);
	});
};
