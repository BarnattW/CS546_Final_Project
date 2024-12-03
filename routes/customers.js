import { Router } from "express";
import {
	checkId,
	checkIsPositiveInteger,
	sanitizeInput,
	sanitizeObject,
} from "../utils/checks.js";
import { customersData } from "../data/index.js";

const router = Router();

/*
 *  /customers
 */
router.route("/").post(async (req, res) => {
	// creates a new customer
	const customerData = req.body;

	// check user input
	if (!customerData || Object.keys(customerData).length === 0) {
		return res
			.status(400)
			.json({ error: "There are no fields in the request body" });
	}

	let checkedCustomer;
	try {
		customerData = sanitizeObject(customerData);
		checkedCustomer = checkCustomer(
			customerData.username,
			customerData.password,
			customerData.name
		);
	} catch (e) {
		return res.status(400).json({ error: e });
	}

	// db insertion
	try {
		const newCustomer = await customersData.createCustomer(
			checkedCustomer.username,
			checkedCustomer.password,
			checkedCustomer.name
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
	.route("/cart/:id")
	.get(async (req, res) => {
		// gets customer's cart with param id
		try {
			req.params.id = checkId(req.params.id, "customerId");
			req.params.id = sanitizeInput(req.params.id);
		} catch (e) {
			return res.status(404).json({ error: e });
		}

		try {
			const cart = await customersData.getCustomerCart(req.params.id);
			return res.json(cart);
		} catch (e) {
			console.log(e);
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
		// add to customer's cart
		const cartItemData = req.body;
		if (!cartItemData || Object.keys(cartItemData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			req.params.id = checkId(req.params.id, "customerId");
			req.params.id = sanitizeInput(req.params.id);

			cartItemData = sanitizeObject(cartItemData);
			cartItemData.listingId = checkId(cartItemData.listingId, "listingId");
			checkIsPositiveInteger(cartItemData.quantity);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const updatedCart = customersData.addToCart(
				req.params.id,
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
		const cartItemData = req.body;
		if (!cartItemData || Object.keys(cartItemData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			req.params.id = checkId(req.params.id, "customerId");
			req.params.id = sanitizeInput(req.params.id);

			cartItemData = sanitizeObject(cartItemData);
			cartItemData.listingId = checkId(cartItemData.listingId, "listingId");
			checkIsPositiveInteger(cartItemData.quantity);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const updatedCart = customersData.updateCart(
				req.params.id,
				cartItemData.listingId,
				cartItemData.quantity
			);
			return res.json(updatedCart);
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	});

router
	.route("/wishlist/:id")
	.get(async (req, res) => {
		// get customer's wishlist
		try {
			req.params.id = checkId(req.params.id, "customerId");
			req.params.id = sanitizeInput(req.params.id);
		} catch (e) {
			return res.status(404).json({ error: e });
		}

		try {
			const wishlist = await customersData.getCustomerWishlist(req.params.id);
			return res.json(wishlist);
		} catch (e) {
			console.log(e);
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
		// add to customer's wishlistconst cartItemData = req.body;
		const wishlistItemData = req.body;
		if (!wishlistItemData || Object.keys(wishlistItemData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			req.params.id = checkId(req.params.id, "customerId");
			req.params.id = sanitizeInput(req.params.id);

			wishlistItemData = sanitizeObject(wishlistItemData);
			wishlistItemData.listingId = checkId(
				wishlistItemData.listingId,
				"listingId"
			);
			checkIsPositiveInteger(wishlistItemData.quantity);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const updatedWishlist = customersData.addToWishlist(
				req.params.id,
				cartItemData.listingId,
				cartItemData.quantity
			);
			return res.json(updatedWishlist);
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	})
	.delete(async (req, res) => {
		// delete item from customer's wishlist
		const wishlistItemData = req.body;
		if (!wishlistItemData || Object.keys(wishlistItemData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			req.params.id = checkId(req.params.id, "customerId");
			req.params.id = sanitizeInput(req.params.id);

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
				req.params.id,
				cartItemData.listingId
			);
			return res.json(updatedWishlist);
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	});

export default router;
