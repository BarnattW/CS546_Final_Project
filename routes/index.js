import customersRoutes from "./customers.js";
import sellersRoutes from "./sellers.js";
import reviewsRoutes from "./reviews.js";
import commentsRoutes from "./comments.js";
import ordersRoutes from "./orders.js";
import pagesRoutes from "./pages.js";

const routeConfig = (app) => {
	app.get("/customer/browselistings", (req, res) => {
        res.render("customer/browselistings");
    });

	app.get("/customer/cart", (req, res) => {
        res.render("customer/cart");
    });

	app.get("/login", (req, res) => {
        res.render("login");
    });

	app.use("/", pagesRoutes);
	app.use("/api/customers", customersRoutes);
	app.use("/api/sellers", sellersRoutes);
	app.use("/api/reviews", reviewsRoutes);
	app.use("/api/comments", commentsRoutes);
	app.use("/api/orders", ordersRoutes);

	app.use("*", (req, res) => {
		res.status(404).json({ error: "Route Not found" });
	});
};

export default routeConfig;
