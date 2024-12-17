import { checkInputEmpty, checkInputLength } from "../helpers.js";

/*
 * Login Pages
 */
const clientErrorDiv = document.getElementById("clientError");
const customerLoginForm = document.getElementById("customerLogin");

customerLoginForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	clientErrorDiv.hidden = true;
	clientErrorDiv.innerHTML = "";
	try {
		customerUsername.value = checkInputEmpty(customerUsername, "Username");
		customerPassword.value = checkInputEmpty(customerPassword, "Password");
		checkInputLength(customerUsername, "Username", 5, 20);
		checkInputLength(customerPassword, "Password", 8);

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
			window.location.reload();
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
