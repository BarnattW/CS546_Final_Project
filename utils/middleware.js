const applyMiddlewares = (app) => {
	// logs information for debugging
	app.use(async (req, res, next) => {
		const date = new Date().toUTCString();
		const method = req.method;
		const route = req.originalUrl;
		const user = req.session.user;

		console.log(
			`[${date}]: ${method} ${route} (${
				user ? "Authenticated" : "Non-Authenticated"
			} ${user?.role == "customer" ? "Customer" : "Seller"}`
		);
		return next();
	});

	// redirects login, logout, and signup routes depending on session status
	app.use(async (req, res, next) => {
		if (req.originalUrl != "/customer/login") return next();

		const user = req.session.user;
		if (!user) return next();

		if (user.role === "customer") res.redirect("/");
	});

	// redirects customer specific routes

	// redirects seller specific routes
};

export default applyMiddlewares;
