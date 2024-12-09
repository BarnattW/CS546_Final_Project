import { Router } from "express";
import {
	checkId,
	checkIsPositiveInteger,
	checkString,
	checkStringLength,
	sanitizeInput,
	sanitizeObject,
} from "../utils/checks.js";
import { customersData } from "../data/index.js";

const router = Router();

/*
 * /customers/login
 */
router.route("/login").post(async (req, res) => {
	const customerData = req.body;

	if (!customerData || Object.keys(customerData).length === 0) {
		return res
			.status(400)
			.json({ error: "There are no fields in the request body" });
	}

	const { username, password } = customerData;
	try {
		customerData = sanitizeObject(customerData);
		username = checkString(username, "Username");
		password = checkString(password, "Password");
		checkStringLength(username, 5, 20);
		checkStringLength(password, 8);
		username = username.toLowerCase();
	} catch (e) {
		return res.status(400).json({ error: e });
	}

	try {
		const user = await customersData.loginCustomer(username, password);
		if (user) {
			req.session.user = {
				_id: user._id,
				username: user.username,
				role: "customer",
			};
		}
	} catch (e) {
		return res.status(400).json({ error: e });
	}
});

/*
 *  /customers/signup
 */
router.route("/signup").post(async (req, res) => {
	// creates a new customer
	const customerData = req.body;

	// check user input
	if (!customerData || Object.keys(customerData).length === 0) {
		return res
			.status(400)
			.json({ error: "There are no fields in the request body" });
	}

	const { username, name, password, confirmPassword } = customerData;
	try {
		customerData = sanitizeObject(customerData);
		username = checkString(username, "Username");
		name = checkString(name, "Name");
		password = checkString(password, "Password");
		confirmPassword = checkString(confirmPassword, "Confirmation Password");
		checkStringLength(username, 5, 20);
		checkStringLength(password, 8);
		checkStringLength(confirmPassword, 8);

		if (password != confirmPassword)
			throw `Password and confirmation password must match`;

		username = username.toLowerCase();
	} catch (e) {
		return res.status(400).json({ error: e });
	}

	// db insertion
	try {
		const newCustomer = await customersData.createCustomer(
			customerData.username,
			customerData.password,
			customerData.name
		);
		return res.json(newCustomer);
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

/*
 * /customers/:id
 */
router.route("/:id").get(async (req, res) => {
	// gets customer with param id
	try {
		req.params.id = checkId(req.params.id, "customerId");
		req.params.id = sanitizeInput(req.params.id);
	} catch (e) {
		console.log(e);
		return res.json({ error: e });
	}

	try {
		const customer = customersData.getCustomerById(req.params.id);
		return res.json(customer);
	} catch (e) {
		console.log(e);
		res.status(404).json({ error: "Customer not found!" });
	}
});

router
	.route("/cart")
	.get(async (req, res) => {
		// gets customer's cart with session user id
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customer/createlogin", { error: e });
		}

		try {
			const cart = await customersData.getCustomerCart(user._id);
			return res.render("customer/cart", { cart });
		} catch (e) {
			console.log(e);
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
		// add to customer's cart
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customer/createlogin", { error: e });
		}

		const cartItemData = req.body;
		if (!cartItemData || Object.keys(cartItemData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			cartItemData = sanitizeObject(cartItemData);
			cartItemData.listingId = checkId(cartItemData.listingId, "listingId");
			checkIsPositiveInteger(cartItemData.quantity);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const updatedCart = customersData.addToCart(
				user._id,
				cartItemData.listingId,
				cartItemData.quantity
			);
			return res.json(updatedCart);
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	})
	.put(async (req, res) => {
		// update customer's cart
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customer/createlogin", { error: e });
		}

		const cartItemData = req.body;
		if (!cartItemData || Object.keys(cartItemData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			cartItemData = sanitizeObject(cartItemData);
			cartItemData.listingId = checkId(cartItemData.listingId, "listingId");
			checkIsPositiveInteger(cartItemData.quantity);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const updatedCart = customersData.updateCart(
				user._id,
				cartItemData.listingId,
				cartItemData.quantity
			);
			return res.json(updatedCart);
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	});

router
	.route("/wishlist/")
	.get(async (req, res) => {
		// get customer's wishlist
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customer/createlogin", { error: e });
		}

		try {
			const wishlist = await customersData.getCustomerWishlist(req.params.id);

			// TODO update with handlebars
			return res.json(wishlist);
		} catch (e) {
			console.log(e);
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
		// add to customer's wishlistconst
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customer/createlogin", { error: e });
		}

		const wishlistItemData = req.body;
		if (!wishlistItemData || Object.keys(wishlistItemData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			wishlistItemData = sanitizeObject(wishlistItemData);
			wishlistItemData.listingId = checkId(
				wishlistItemData.listingId,
				"listingId"
			);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const updatedWishlist = customersData.addToWishlist(
				user._id,
				wishlistItemData.listingId
			);
			return res.json(updatedWishlist);
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	})
	.delete(async (req, res) => {
		// delete item from customer's wishlist
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customer/createlogin", { error: e });
		}

		const wishlistItemData = req.body;
		if (!wishlistItemData || Object.keys(wishlistItemData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			wishlistItemData = sanitizeObject(wishlistItemData);
			wishlistItemData.listingId = checkId(
				wishlistItemData.listingId,
				"listingId"
			);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const updatedWishlist = customersData.removeFromWishlist(
				user._id,
				cartItemData.listingId
			);
			return res.json(updatedWishlist);
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	});

export default router;
