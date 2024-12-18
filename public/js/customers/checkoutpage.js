import { checkInputEmpty, checkRegex, showErrorDialog } from "../helpers.js";

/*
 * Checkout page
 */
function formatShippingAddress(address, city, state, zip, country) {
	if (!address || !city || !state || !zip || !country) {
		throw new Error(
			"All fields (address, city, state, zip, country) are required."
		);
	}

	return `${address}\n${city}, ${state} ${zip}\n${country}`;
}

const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
	checkoutForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		try {
			const fullName = document.getElementById("fullName");
			fullName.value = checkInputEmpty(fullName, "Full Name");

			const address = document.getElementById("address");
			const city = document.getElementById("city");
			const state = document.getElementById("state");
			const zip = document.getElementById("zipCode");
			const country = document.getElementById("country");
			address.value = checkInputEmpty(address, "Address");
			city.value = checkInputEmpty(city, "City");
			state.value = checkInputEmpty(state, "State");
			zip.value = checkInputEmpty(zip, "Zip Code");
			country.value = checkInputEmpty(country, "Country");

			// do regex checks on fields
			checkRegex(
				fullName.value,
				/^[a-zA-Z ]+$/,
				"Please enter a valid full name."
			);
			checkRegex(city.value, /^[a-zA-Z ]+$/, "Please enter a valid city name.");
			checkRegex(
				state.value,
				/^[a-zA-Z ]+$/,
				"Please enter a valid state name."
			);
			checkRegex(
				zip.value,
				/^[0-9]{5}(?:-[0-9]{4})?$/,
				"Please enter a valid ZIP code."
			);
			checkRegex(
				country.value,
				/^[a-zA-Z ]+$/,
				"Please enter a valid country name."
			);

			// Get card credentials. For now, we'll just use the card number
			const cardNumber = document.getElementById("cardNumber");
			const expirationDate = document.getElementById("expirationDate");
			const cvv = document.getElementById("cvv");
			cardNumber.value = checkInputEmpty(cardNumber, "Card Number");
			checkRegex(
				cardNumber.value,
				/^[0-9]{16}$/,
				"Please enter a valid 16-digit-card number."
			);
			checkRegex(
				expirationDate.value,
				/^(0[1-9]|1[0-2])\/([0-9]{2})$/,
				"Please enter a valid expiry date in MM/YY format."
			);
			// check if expiray date is in the future
			const today = new Date();
			const [month, year] = expirationDate.value.split("/");
			const expiration = new Date(`20${year}`, month - 1);
			if (expiration < today) {
				throw "Expiration date must be in the future.";
			}
			checkRegex(
				cvv.value,
				/^[0-9]{3,4}$/,
				"Please enter a valid 3 or 4 digit CVV."
			);

			const response = await fetch("/customers/orders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: fullName.value,
					address: address.value,
					city: city.value,
					state: state.value,
					zip: zip.value,
					country: country.value,
					cardNumber: cardNumber.value,
					expirationDate: expirationDate.value,
					cvv: cvv.value,
				}),
			});

			if (response.ok) {
				window.location.href = "/customers/orders";
			} else {
				const data = await response.json();
				throw JSON.stringify(data);
			}
		} catch (e) {
			showErrorDialog(e);
		}
	});
}
