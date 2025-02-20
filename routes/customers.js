import { Router } from "express";
import {
	checkId,
	checkIsPositiveInteger,
	checkString,
	checkStringLength,
	sanitizeObject,
} from "../utils/checks.js";
import { customersData } from "../data/index.js";
import ordersRoutes from "./orders.js";

const router = Router();

/*
 * /customers/login
 */
router
	.route("/login")
	.get(async (req, res) => {
		try {
			return res.render("customers/customerlogin", { user: req.session.user });
		} catch (e) {
			return res.status(404).render("error", { error: e });
		}
	})
	.post(async (req, res) => {
		let customerData = req.body;

		if (!customerData || Object.keys(customerData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			customerData = sanitizeObject(customerData);
		} catch (e) {
			return res.status(400).json({ error: e });
		}

		let { username, password } = customerData;
		try {
			username = checkString(username, "Username");
			password = checkString(password, "Password");
			checkStringLength(username, 5, 20);
			checkStringLength(password, 8);
			username = username.toLowerCase();
		} catch (e) {
			console.log(e);
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
			return res.json();
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	});

/*
 *  /customers/signup
 */
router.route("/signup").post(async (req, res) => {
	// creates a new customer
	let customerData = req.body;

	// check user input
	if (!customerData || Object.keys(customerData).length === 0) {
		return res
			.status(400)
			.json({ error: "There are no fields in the request body" });
	}

	try {
		customerData = sanitizeObject(customerData);
	} catch (e) {
		return res.status(400).json({ error: e });
	}

	let { username, name, password, confirmPassword } = customerData;
	try {
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
		console.log(e);
		return res.status(400).json({ error: e });
	}

	// db insertion
	try {
		const newCustomer = await customersData.createCustomer(
			username,
			password,
			name
		);
		return res.json(newCustomer);
	} catch (e) {
		return res.status(500).json({ error: e });
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
			return res.status(401).render("customerlogin", { error: e });
		}

		try {
			const cartData = await customersData.getCustomerCart(user._id);
			return res.render("customers/customercart", {
				cart: cartData.populatedCart,
				totalItems: cartData.totalItems,
				totalPrice: cartData.totalPrice,
				user: req.session.user,
			});
		} catch (e) {
			console.log(e);
			return res.status(404).render("error", { error: e });
		}
	})
	.post(async (req, res) => {
		// add to customer's cart
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customerlogin", { error: e });
		}

		let cartItemData = req.body;
		if (!cartItemData || Object.keys(cartItemData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			cartItemData = sanitizeObject(cartItemData);
			cartItemData.listingId = checkId(cartItemData.listingId, "listingId");
			cartItemData.quantity = Number(cartItemData.quantity);
			checkIsPositiveInteger(cartItemData.quantity);
			if (cartItemData.quantity < 0) cartItemData.quantity = 1;
			if (cartItemData.quantity > 5) cartItemData.quantity = 5;
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const updatedCart = await customersData.addToCart(
				user._id,
				cartItemData.listingId,
				cartItemData.quantity
			);
			return res.json(updatedCart);
		} catch (e) {
			console.log(e);
			return res.status(500).json({ error: e });
		}
	})
	.put(async (req, res) => {
		// update customer's cart
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customerlogin", { error: e });
		}

		let cartItemData = req.body;
		if (!cartItemData || Object.keys(cartItemData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			cartItemData = sanitizeObject(cartItemData);
			cartItemData.listingId = checkId(cartItemData.listingId, "listingId");
			checkIsPositiveInteger(cartItemData.quantity);
			cartItemData.quantity = Number(cartItemData.quantity);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const updatedCart = await customersData.updateCart(
				user._id,
				cartItemData.listingId,
				cartItemData.quantity
			);
			return res.json(updatedCart);
		} catch (e) {
			console.log(e);
			return res.status(500).json({ error: e });
		}
	});

router
	.route("/wishlist")
	.get(async (req, res) => {
		// get customer's wishlist
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customerlogin", { error: e });
		}

		try {
			const wishlist = await customersData.getCustomerWishlist(
				req.session.user._id
			);
			return res.render("customers/customerwishlist", {
				user: req.session.user,
				wishlist,
			});
		} catch (e) {
			console.log(e);
			return res.status(404).render("error", { error: e });
		}
	})
	.post(async (req, res) => {
		// add to customer's wishlistconst
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customerlogin", { error: e });
		}

		let wishlistItemData = req.body;
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
			const updatedWishlist = await customersData.addToWishlist(
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
			return res.status(401).render("customerlogin", { error: e });
		}

		let wishlistItemData = req.body;
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
			const updatedWishlist = await customersData.removeFromWishlist(
				user._id,
				wishlistItemData.listingId
			);
			return res.json(updatedWishlist);
		} catch (e) {
			console.log(e);
			return res.status(500).json({ error: e });
		}
	});

router.route("/moveWishlistToCart").put(async (req, res) => {
	// move item from wishlist to cart
	const user = req.session.user;
	try {
		if (!user) throw `Session user not found. Login again.`;
	} catch (e) {
		return res.status(401).render("customerlogin", { error: e });
	}

	let wishlistItemData = req.body;
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
		const updatedCart = await customersData.moveFromWishlistToCart(
			user._id,
			wishlistItemData.listingId
		);
		return res.json(updatedCart);
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: e });
	}
});

router.route("/checkout").get(async (req, res) => {
	const user = req.session.user;
	try {
		if (!user) throw `Session user not found. Login again.`;
	} catch (e) {
		return res.status(401).render("customerlogin", { error: e });
	}

	try {
		const cartData = await customersData.getCustomerCart(user._id);
		res.render("customers/checkout", {
			user: req.session.user,
			cart: cartData.populatedCart,
			totalItems: cartData.totalItems,
			totalPrice: cartData.totalPrice,
		});
	} catch (e) {
		return res.status(404).render("error", { error: e });
	}
});

router.use("/orders", ordersRoutes);

export default router;
