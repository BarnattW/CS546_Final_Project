import { Router } from "express";
import { checkId, sanitizeInput, sanitizeObject } from "../utils/checks.js";
import { ordersData } from "../data/index.js";

const router = Router();

/*
 * /customers/orders | /sellers/orders
 */
router
	.route("/")
	.get(async (req, res) => {
		// gets all customer or seller orders depoending on session user role
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customerlogin", { error: e });
		}

		//  - changed render handlebars
		try {
            if (user.role === "customer") {
                const customerOrders = await ordersData.getCustomerOrders(user._id);
                return res.render("orders", {
                    pageTitle: "Your Orders",
                    role: user.role,
                    orders: customerOrders,
                });
            } else if (user.role === "seller") {
                const sellerOrders = await ordersData.getSellerOrders(user._id);
                return res.render("orders", {
                    pageTitle: "Your Orders",
                    role: user.role,
                    orders: sellerOrders,
                });
            } else {
                return res.status(403).render("customerlogin", {
                    error: "Session user role not found. Login again.",
                });
            }
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
			return res.status(401).render("customerlogin", { error: e });
		}

		if (user.role != "customer") {
			return res
				.status(403)
				.render("customerlogin", { error: "Only customers can place orders" });
		}

		const orderData = req.body;

		if (!orderData || Object.keys(orderData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			const orderData = sanitizeObject(ordersData);
			orderData.orderItems.map((orderItem) => {
				orderItem = sanitizeObject(orderItem);
				orderItem.itemId = checkId(orderItem.listingId, "listingIdId");
				checkIsPositiveInteger(orderItem.quantity);
				return orderItem;
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
				user._id,
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
 * /customers/orders/:orderId | /sellers/orders/:orderId
 */
router.route("/:orderId").get(async (req, res) => {
	// gets a specific customer's order
	const user = req.session.user;
	try {
		if (!user) throw `Session user not found. Login again.`;
	} catch (e) {
		return res.status(401).render("customerlogin", { error: e });
	}

	// check the input
	try {
		req.params.orderId = checkId(req.params.orderId, "orderId");
		req.params.orderId = sanitizeInput(req.params.orderId);
	} catch (e) {
		console.log(e);
		return res.status(404).json({ error: e });
	}

	// check the role
	try {
        if (user.role === "customer") {
            const customerOrder = await ordersData.getCustomerOrder(user._id, req.params.orderId);
            return res.render("order-details", {
                pageTitle: `Order Details - ${req.params.orderId}`,
                role: user.role,
                order: customerOrder,
            });
        } else if (user.role === "seller") {
            const sellerOrder = await ordersData.getSellerOrder(user._id, req.params.orderId);
            return res.render("order-details", {
                pageTitle: `Order Details - ${req.params.orderId}`,
                role: user.role,
                order: sellerOrder,
            });
        }
	} catch (e) {
		console.log(e);
		return res.status(404).json({ error: e });
	}
})

.delete(async (req, res) => {
	const user = req.session.user;

	if (!user) {
		return res.status(401).json({ error: "Session user not found. Login again." });
	}

	try {
		req.params.orderId = checkId(req.params.orderId, "orderId");
		req.params.orderId = sanitizeInput(req.params.orderId);
	} catch (e) {
		console.log(e);
		return res.status(400).json({ error: e });
	}

	try {
		if (user.role === "customer") {
			const deletedOrder = await ordersData.deleteCustomerOrder(user._id, req.params.orderId);
			if (deletedOrder) {
				return res.json({ success: true, message: "Order successfully cancelled." });
			}
		} else if (user.role === "seller") {
			const deletedOrder = await ordersData.deleteSellerOrder(user._id, req.params.orderId);
			if (deletedOrder) {
				return res.json({ success: true, message: "Order successfully cancelled." });
			}
		} else {
			return res.status(403).json({ error: "Invalid user role." });
		}

		return res.status(404).json({ error: "Order not found or could not be cancelled." });
	} catch (e) {
		console.log(e);
		return res.status(500).json({ error: "Failed to cancel the order. Please try again later." });
	}
});



export default router;
