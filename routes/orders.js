import { Router } from "express";
import {
	checkId,
	checkRegex,
	checkString,
	formatShippingAddress,
	sanitizeInput,
	sanitizeObject,
} from "../utils/checks.js";
import { customersData, ordersData } from "../data/index.js";

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
			return res.status(401).render("sellers/sellerlogin", { error: e });
		}

		// changed render handlebars
		try {
			if (user.role === "customer") {
				const customerOrders = await ordersData.getCustomerOrders(user._id);
				return res.render("orders/orders", {
					pageTitle: "Your Orders",
					orders: customerOrders,
					user: req.session.user,
				});
			} else if (user.role === "seller") {
				const sellerOrders = await ordersData.getSellerOrders(user._id);

				return res.render("orders/orders", {
					pageTitle: "Your Orders",
					orders: sellerOrders,
					user: req.session.user,
				});
			} else {
				return res.status(403).render("customers/customerlogin", {
					error: "Session user role not found. Login again.",
				});
			}
		} catch (e) {
			console.log(e);
			return res.status(404).render("error", { error: e });
		}
	})
	.post(async (req, res) => {
		// create an order
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).status(401).json({ error: e });
		}

		if (user.role != "customer") {
			return res.status(403).json({ error: "Only customers can place orders" });
		}

		let orderData = req.body;

		if (!orderData || Object.keys(orderData).length === 0) {
			return res
				.status(400)
				.json({ error: "There are no fields in the request body" });
		}

		try {
			orderData = sanitizeObject(orderData);
			orderData.name = checkString(orderData.name, "name");
			orderData.address = checkString(orderData.address, "address");
			orderData.city = checkString(orderData.city, "city");
			orderData.state = checkString(orderData.state, "state");
			orderData.zip = checkString(orderData.zip, "zip");
			orderData.country = checkString(orderData.country, "country");
			checkRegex(orderData.name, /^[a-zA-Z ]+$/, "Invalid full name.");
			checkRegex(orderData.city, /^[a-zA-Z ]+$/, "Invalid city name.");
			checkRegex(orderData.state, /^[a-zA-Z ]+$/, "Invalid state name.");
			checkRegex(
				orderData.zip,
				/^[0-9]{5}(?:-[0-9]{4})?$/,
				"Invalid ZIP code."
			);
			checkRegex(orderData.country, /^[a-zA-Z ]+$/, "Invalid country name.");
			orderData.cardNumber = checkString(orderData.cardNumber, "cardNumber");
			orderData.expirationDate = checkString(
				orderData.expirationDate,
				"expirationDate"
			);
			orderData.cvv = checkString(orderData.cvv, "cvv");
			checkRegex(
				orderData.cardNumber,
				/^[0-9]{16}$/,
				"Invalid 16-digit-card number."
			);
			checkRegex(
				orderData.expirationDate,
				/^(0[1-9]|1[0-2])\/([0-9]{2})$/,
				"Invalid expiry date in MM/YY format."
			);
			const today = new Date();
			const [month, year] = orderData.expirationDate.split("/");
			const expiration = new Date(`20${year}`, month - 1);
			if (expiration < today) {
				throw "Expiration date must be in the future.";
			}
			checkRegex(orderData.cvv, /^[0-9]{3,4}$/, "Invalid 3 or 4 digit CVV.");
		} catch (e) {
			console.log(e);
			return res.status(400).json({ error: e });
		}

		try {
			const { populatedCart, totalItems, totalPrice } =
				await customersData.getCustomerCart(user._id);
			const shippingAddress = formatShippingAddress(
				orderData.address,
				orderData.city,
				orderData.state,
				orderData.zip,
				orderData.country
			);
			const newOrder = await ordersData.createOrder(
				user._id,
				orderData.name,
				populatedCart,
				shippingAddress,
				orderData.cardNumber,
				orderData.expirationDate,
				orderData.cvv,
				totalPrice
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
router
	.route("/:orderId")
	.get(async (req, res) => {
		// gets a specific customer's order
		const user = req.session.user;
		try {
			if (!user) throw `Session user not found. Login again.`;
		} catch (e) {
			return res.status(401).render("customers/customerlogin", { error: e });
		}

		// check the input
		try {
			req.params.orderId = checkId(req.params.orderId, "orderId");
			req.params.orderId = sanitizeInput(req.params.orderId);
		} catch (e) {
			console.log(e);
			return res.status(404).render("error", { error: e });
		}

		// check the role
		try {
			if (user.role === "customer") {
				const customerOrder = await ordersData.getCustomerOrder(
					user._id,
					req.params.orderId
				);
				console.log(customerOrder.orderItems);
				return res.render("orders/order-details", {
					user,
					pageTitle: `Order Details - ${req.params.orderId}`,
					order: customerOrder,
				});
			} else if (user.role === "seller") {
				const sellerOrder = await ordersData.getSellerOrder(
					user._id,
					req.params.orderId
				);
				return res.render("orders/order-details", {
					user,
					pageTitle: `Order Details - ${req.params.orderId}`,
					order: sellerOrder,
				});
			}
		} catch (e) {
			console.log(e);
			return res.status(404).render("error", { error: e });
		}
	})
	.delete(async (req, res) => {
		const user = req.session.user;

		if (!user) {
			return res
				.status(401)
				.json({ error: "Session user not found. Login again." });
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
				const deletedOrder = await ordersData.deleteCustomerOrder(
					user._id,
					req.params.orderId
				);
				if (deletedOrder) {
					return res.json({
						success: true,
						message: "Order successfully cancelled.",
					});
				}
			} else if (user.role === "seller") {
				const deletedOrder = await ordersData.deleteSellerOrder(
					user._id,
					req.params.orderId
				);
				if (deletedOrder) {
					return res.json({
						success: true,
						message: "Order successfully cancelled.",
					});
				}
			} else {
				return res.status(403).json({ error: "Invalid user role." });
			}

			return res
				.status(404)
				.json({ error: "Order not found or could not be cancelled." });
		} catch (e) {
			console.log(e);
			return res
				.status(500)
				.json({ error: "Failed to cancel the order. Please try again later." });
		}
	});

export default router;
