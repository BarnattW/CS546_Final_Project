import customersRoutes from "./customers.js";
import sellersRoutes from "./sellers.js";

const routeConfig = (app) => {
	app.use("/customers", customersRoutes);
	app.use("/sellers", sellersRoutes);

	app.use("*", (req, res) => {
		res.status(404).json({ error: "Route Not found" });
	});
};

export default routeConfig;
