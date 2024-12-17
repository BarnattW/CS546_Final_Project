import {
	checkInputEmpty,
	checkInputLength,
	showErrorDialog,
} from "../helpers.js";

const sellerLoginForm = document.getElementById("sellerLogin");
const sellerUsername = document.getElementById("sellerUsername");
const sellerPassword = document.getElementById("sellerPassword");

sellerLoginForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		sellerUsername.value = checkInputEmpty(sellerUsername, "Username");
		sellerPassword.value = checkInputEmpty(sellerPassword, "Password");
		checkInputLength(sellerUsername, "Username", 5, 20);
		checkInputLength(sellerPassword, "Password", 8);

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
			throw JSON.stringify(data.error);
		}
	} catch (e) {
		showErrorDialog(e);
	}
});
