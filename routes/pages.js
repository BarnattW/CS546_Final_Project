import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
	try {
		return res.render("home", { user: req.session.user });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.get("/signup", async (req, res) => {
	try {
		return res.render("signupuser");
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.get("/signout", async (req, res) => {
	try {
		if (req.session) {
			req.session.destroy();
		}
		return res.render("signoutuser");
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.get("/checkout", async (req, res) => {
	const user = req.session.user;
	try {
		if (!user) throw `Session user not found. Login again.`;
	} catch (e) {
		return res.status(401).render("customerlogin", { error: e });
	}
	try {
		res.render("checkout");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.post("/checkout", (req, res) => {
	const user = req.session.user;
	if (!user) {
		return res.status(401).render("customerlogin", {
			error: "Session user not found. Login again.",
		});
	}

	const { fullName, address, city, state, zipCode, country } = req.body;

	const errors = [];

	if (!fullName || !/^[a-zA-Z ]+$/.test(fullName)) {
		errors.push("Invalid full name: only alphabets and spaces are allowed.");
	}
	if (!address || address.trim().length === 0) {
		errors.push("Address cannot be empty.");
	}
	if (!city || !/^[a-zA-Z ]+$/.test(city)) {
		errors.push("Invalid city: only alphabets and spaces are allowed.");
	}
	if (!state || !/^[a-zA-Z ]+$/.test(state)) {
		errors.push("Invalid state: only alphabets and spaces are allowed.");
	}
	if (!zipCode || !/^\d{5}(?:-\d{4})?$/.test(zipCode)) {
		errors.push("Invalid ZIP code: must be 12345 or 12345-6789.");
	}
	if (!country || !/^[a-zA-Z ]+$/.test(country)) {
		errors.push("Invalid country: only alphabets and spaces are allowed.");
	}

	if (errors.length > 0) {
		return res
			.status(400)
			.render("checkout", { error: errors.join(", "), formData: req.body });
	}

	res.redirect("/payment");
});

router.post("/process-payment", (req, res) => {
	const { cardNumber, expiryDate, cvv, cardholderName } = req.body;

	const errors = [];

	if (!cardNumber || !/^\d{16}$/.test(cardNumber)) {
		errors.push("Invalid card number: must be 16 digits.");
	}
	if (!expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
		errors.push("Invalid expiry date: must be in MM/YY format.");
	}
	if (!cvv || !/^\d{3,4}$/.test(cvv)) {
		errors.push("Invalid CVV: must be 3 or 4 digits.");
	}
	if (!cardholderName || !/^[a-zA-Z ]+$/.test(cardholderName)) {
		errors.push(
			"Invalid cardholder name: only alphabets and spaces are allowed."
		);
	}

	if (errors.length > 0) {
		return res
			.status(400)
			.render("payment", { error: errors.join(", "), formData: req.body });
	}

	console.log("Processing payment with details:", {
		cardNumber,
		expiryDate,
		cvv,
	});
	res.render("payment-success", {
		pageTitle: "Payment Successful",
		message: "Thank you! Your payment has been processed successfully.",
	});
});

export default router;
