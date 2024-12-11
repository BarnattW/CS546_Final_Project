import { Router } from "express";
import { checkId, sanitizeInput, sanitizeObject } from "../utils/checks.js";
import { ordersData } from "../data/index.js";

const router = Router();

/*
 * /orders/customer/:id
 */
router
	.route("/customers/:id")
	.get(async (req, res) => {
		// gets all customer orders
		try {
			req.params.id = checkId(req.params.id, "customerId");
			req.params.id = sanitizeInput(req.params.id);
		} catch (e) {
			console.log(e);
			return res.status(404).json({ error: e });
		}

		try {
			const customerOrders = await ordersData.getCustomerOrders(req.params.id);
			return res.json(customerOrders);
		} catch (e) {
			console.log(e);
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
		const orderData = req.body;

		if (!orderData || Object.keys(orderData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			req.params.id = checkId(req.params.id, "customerId");
			req.params.id = sanitizeInput(req.params.id);

			const orderData = sanitizeObject(ordersData);
			orderData.orderItems.map((itemId) => {
				itemId = checkId(itemId, "itemId");
				return sanitizeInput(itemId);
			});
			orderData.shippingAddress = checkString(
				orderDatashippingAddress,
				"shippingAddress"
			);
			orderData.shippingAddress = sanitizeInput(orderData.shippingAddress);
			checkIsPositiveInteger(orderData.cost);
			orderData.cost = sanitizeInput(orderData.cost);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const newOrder = await ordersData.createOrder(
				req.params.id,
				orderData.orderItems,
				orderData.shippingAddress,
				orderData.cost
			);
			return res.json(newOrder);
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}
	});

/*
 * /orders/order/:orderId/customers/:customerId
 */
router.route("/order/:orderId/customers/:customerId").get(async (req, res) => {
	// gets a specific customer's order
	try {
		req.params.orderId = checkId(req.params.orderId, "orderId");
		req.params.customerId = checkId(req.params.customerId, "customerId");

		req.params.orderId = sanitizeInput(req.params.orderId);
		req.params.customerId = sanitizeInput(req.params.customerId);
	} catch (e) {
		console.log(e);
		return res.status(404).json({ error: e });
	}

	try {
		const customerOrder = await ordersData.getCustomerOrder(
			req.params.customerId,
			req.params.orderId
		);
		return res.json(customerOrder);
	} catch (e) {
		console.log(e);
		return res.status(404).json({ error: e });
	}
});

/*
 * /orders//sellers/:sellerId
 */
router.route("/sellers/:sellerId").get(async (req, res) => {
	// gets all seller's order
	try {
		req.params.sellerId = checkId(req.params.sellerId, "sellerId");
		req.params.sellerId = sanitizeInput(req.params.sellerId);
	} catch (e) {
		console.log(e);
		return res.status(404).json({ error: e });
	}

	try {
		const sellerOrders = await ordersData.getSellerOrders(req.params.sellerId);
		return res.json(sellerOrders);
	} catch (e) {
		console.log(e);
		return res.status(404).json({ error: e });
	}
});

/*
 * /orders/order/:orderId/sellers/:sellerId
 */
router.route("/order/:orderId/sellers/:sellerId").get(async (req, res) => {
	// gets a specific seller's order
	try {
		req.params.orderId = checkId(req.params.orderId, "orderId");
		req.params.sellerId = checkId(req.params.sellerId, "sellerId");

		req.params.orderId = sanitizeInput(req.params.orderId);
		req.params.sellerId = sanitizeInput(req.params.sellerId);
	} catch (e) {
		console.log(e);
		return res.status(404).json({ error: e });
	}

	try {
		const sellerOrder = await ordersData.getSellerOrder(
			req.params.sellerId,
			req.params.orderId
		);
		return res.json(sellerOrder);
	} catch (e) {
		console.log(e);
		return res.status(404).json({ error: e });
	}
});

export default router;
