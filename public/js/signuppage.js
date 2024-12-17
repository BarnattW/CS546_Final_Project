import {
	checkInputEmpty,
	checkInputLength,
	showErrorDialog,
} from "./helpers.js";
/*
 * Signup Page
 */

// Signup Tabs
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

// Form Submission
const customerSignupForm = document.getElementById("customerSignup");
const sellerSignupForm = document.getElementById("sellerSignup");

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

customerSignupForm.addEventListener("submit", async (event) => {
	event.preventDefault();

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
			throw JSON.stringify(data.error);
		}
	} catch (e) {
		showErrorDialog(e);
	}
});

sellerSignupForm.addEventListener("submit", async (event) => {
	event.preventDefault();

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
			throw JSON.stringify(data.error);
		}
	} catch (e) {
		showErrorDialog(e);
	}
});
