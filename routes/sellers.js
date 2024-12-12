import { Router } from "express";
const router = Router();
import { sellersData } from "../data/index.js";
import * as validation from "../utils/checks.js";

/*
 * /sellers/login
 */
router
	.route("/login")
	.get(async (req, res) => {
		try {
			return res.render("sellerlogin", { user: req.session.user });
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
		let sellerData = req.body;

		if (!sellerData || Object.keys(sellerData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		let { username, password } = sellerData;
		try {
			sellerData = validation.sanitizeObject(sellerData);
			username = validation.checkString(username, "Username");
			password = validation.checkString(password, "Password");
			validation.checkStringLength(username, 5, 20);
			validation.checkStringLength(password, 8);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const user = await sellersData.loginSeller(username, password);
			if (user) {
				req.session.user = {
					_id: user._id,
					username: user.username,
					role: "seller",
				};
			}
			res.redirect("/");
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}
	});

/*
 * /sellers/signup
 */
router.route("/signup").post(async (req, res) => {
	let sellerData = req.body;
	if (!sellerData || Object.keys(sellerData).length === 0) {
		return res
			.status(400)
			.json({ error: "There are no fields in the request body" });
	}
	let { username, businessName, town, password, confirmPassword } = sellerData;
	try {
		sellerData = validation.sanitizeObject(sellerData);
		username = validation.checkString(username, "Username");
		businessName = validation.checkString(businessName, "Business Name");
		town = validation.checkString(town, "Town");
		password = validation.checkString(password, "Password");
		confirmPassword = validation.checkString(
			confirmPassword,
			"Confirmation Password"
		);
		validation.checkStringLength(username, 5, 20);
		validation.checkStringLength(password, 8);
		validation.checkStringLength(confirmPassword, 8);

		if (password != confirmPassword)
			throw `Password and confirmation password must match`;
	} catch (e) {
		console.log(e);
		return res.status(400).json({ error: e });
	}

	// db insertion
	try {
		const newSeller = await sellersData.createSeller(
			username,
			password,
			businessName,
			town
		);
		return res.json(newSeller);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: e });
	}
});

// GET

router
	.route("/")
	.get(async (req, res) => {
		try {
			const sellersList = await sellersData.getAllSellers();
			return res.render(sellersList);
		} catch (e) {
			return res.status(500).render("error", { error: e });
		}
	})
	.post(async (req, res) => {
		const requestBodyData = req.body;

		if (!requestBodyData || Object.keys(requestBodyData).length === 0) {
			return res
				.status(400)
				.render("error", { error: "Could not get Request Body." });
		}
		try {
			// Validation of Request Body Data

			requestBodyData.username = validation.checkString(
				requestBodyData.username
			);
			requestBodyData.password = validation.checkString(
				requestBodyData.password
			);
			requestBodyData.name = validation.checkString(requestBodyData.name);
			requestBodyData.town = validation.checkString(requestBodyData.town);
		} catch (e) {
			return res.status(500).render("error", { error: e });
		}

		//

		try {
			const { username, password, name, town } = requestBodyData;

			const newSeller = await sellersData.createSeller(
				username,
				password,
				name,
				town
			);
		} catch (e) {
			return res.status(500).render("error", { error: e });
		}
	});

	router
	.route("/addlisting")
	.get(async (req, res) => {
		try {
			return res.render("addlisting", { user: req.session.user });

		} catch (e) {
			return res.status(500).render("error", { error: e });
		}
	})

// Export Router

export default router;
