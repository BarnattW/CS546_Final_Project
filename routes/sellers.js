import { Router } from "express";
const router = Router();
import { sellersData } from "../data/index.js";
import { orderDataFunctions } from "../data/orders.js";
import * as validation from "../utils/checks.js";

/*
 * /sellers/login
 */
router
	.route("/login")
	.get(async (req, res) => {
		try {
			return res.render("sellers/sellerlogin", { user: req.session.user });
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

		try {
			sellerData = validation.sanitizeObject(sellerData);
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		let { username, password } = sellerData;
		try {
			username = validation.checkString(username, "Username");
			password = validation.checkString(password, "Password");
			validation.checkStringLength(username, 5, 20);
			validation.checkStringLength(password, 8);
			username = username.toLowerCase();
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
			return res.status(500).json({ error: e });
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

	try {
		sellerData = validation.sanitizeObject(sellerData);
	} catch (e) {
		return res.status(400).json({ error: e });
	}

	let { username, businessName, town, password, confirmPassword } = sellerData;
	try {
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
		username = username.toLowerCase();

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

// /sellers/addlisting

router.route("/addlisting").post(async (req, res) => {
	// post sellers listings
	// get request body, verify it
	// add listing to db using data function
	// redirect to wherever lists all listings

	let listingData = req.body; // from form

	if (!listingData || Object.keys(listingData).length === 0) {
		return res
			.status(400)
			.json({ error: "There are no fields in the request body" });
	}

	try {
		listingData = validation.sanitizeObject(listingData);
	} catch (e) {
		return res.status(400).json({ error: e });
	}

	let {
		itemName,
		itemDescription,
		itemPrice,
		itemImage,
		itemCategory,
		condition,
	} = listingData;

	try {
		itemName = validation.checkString(itemName, "Item Name");
		itemDescription = validation.checkString(
			itemDescription,
			"Item Description"
		);
		validation.checkIsPositiveNumber(itemPrice);
		if (itemPrice < 1 || itemPrice > 10000)
			throw `Price must be between 1 and 10000`;
		itemImage = validation.checkString(itemImage, "Item Image");
		itemCategory = validation.checkString(itemCategory, "Item Catagory");
		condition = validation.checkString(condition, "Condition");
	} catch (e) {
		console.log(e);
		return res.status(400).json({ error: e });
	}

	try {
		const newListing = await sellersData.createListing(
			req.session.user._id,
			itemName,
			itemDescription,
			itemPrice,
			itemImage,
			itemCategory,
			condition
		);
		return res.status(200).json();
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: e });
	}
});

router
	.route("/listings")
	.get(async (req, res) => {
		const user = req.session.user;

		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("sellerlogin", { error: e });
		}

		try {
			let listings = await sellersData.getAllSellerListings(
				req.session.user._id
			);
			return res.render("sellers/sellerlistings", {
				user: req.session.user,
				listings,
			});
		} catch (e) {
			console.log(e);
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customerlogin", { message: e });
		}

		const reviewData = req.body;

		if (!reviewData || Object.keys(reviewData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			reviewData = validation.sanitizeObject(reviewData);
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		let { listingId, rating, reviewText } = reviewData;
		try {
			listingId = validation.checkId(listingId, "Listing ID");
			validation.checkIsPositiveInteger(rating);
			reviewText = validation.checkString(reviewText, "Review Text");
		} catch (e) {
			return res.status(404).json("error", { message: e });
		}

		try {
			const customer = await customerDataFunctions.getCustomerById(
				req.session.user._id
			);
			const name = customer.name;

			let newReview = await reviewDataFunctions.createReview(
				req.session.user._id,
				name,
				listingId,
				rating,
				reviewText
			);

			return res.json(newReview);
		} catch (e) {
			return res.status(404).json("error", { message: e });
		}
	});

router
	.route("/listings/:listingId")
	.get(async (req, res) => {
		try {
			req.params.listingId = validation.checkId(
				req.params.listingId,
				"listingId"
			);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			let listing = await sellersData.getListingById(req.params.listingId);
			return res.render("listing", {
				user: req.session.user,
				listing,
				reviews: listing.reviews,
				comments: listing.comments,
			});
		} catch (e) {
			console.log(e);
			return res.status(404).json({ error: e });
		}
	})
	.delete(async (req, res) => {
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("sellerlogin", { message: e });
		}

		try {
			req.params.listingId = validation.checkId(
				req.params.listingId,
				"listingId"
			);
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		try {
			let listing = await sellersData.deleteListing(req.params.listingId);
			return res.json(listing);
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	})
	.put(async (req, res) => {
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("sellerlogin", { message: e });
		}

		let listingData = req.body;
		if (!listingData || Object.keys(listingData).length === 0) {
			return res.status(400).json({ error: e });
		}

		try {
			listingData = validation.sanitizeObject(listingData);
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		let {
			itemName,
			itemDescription,
			itemPrice,
			itemImage,
			itemCategory,
			condition,
		} = listingData;
		try {
			itemName = validation.checkString(itemName, "Item Name");
			itemDescription = validation.checkString(
				itemDescription,
				"Item Description"
			);
			validation.checkIsPositiveNumber(itemPrice);
			if (itemPrice < 1 || itemPrice > 10000)
				throw `Price must be between 1 and 10000`;
			itemImage = validation.checkString(itemImage, "Item Image");
			itemCategory = validation.checkString(itemCategory, "Item Catagory");
			condition = validation.checkString(condition, "Condition");
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		try {
			const updatedListing = await sellersData.updateListing(
				req.params.listingId,
				itemName,
				itemDescription,
				itemPrice,
				itemImage,
				itemCategory,
				condition
			);
			return res.json(updatedListing);
		} catch (e) {
			console.log(e);
			return res.status(500).json({ error: e });
		}
	});

export default router;
