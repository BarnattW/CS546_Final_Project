const applyMiddlewares = (app) => {
	// logs information for debugging
	app.use(async (req, res, next) => {
		const date = new Date().toUTCString();
		const method = req.method;
		const route = req.originalUrl;
		const user = req.session.user;

		console.log(
			`[${date}]: ${method} ${route} (${
				user
					? `Authenticated ${user.role === "customer" ? "Customer" : "Seller"}`
					: "Non-Authenticated"
			})`
		);
		return next();
	});

	// redirects login, logout, and signup routes depending on session status
	app.use(async (req, res, next) => {
		if (
			req.originalUrl != "/customers/login" &&
			req.originalUrl != "/sellers/login" &&
			req.originalUrl != "/signup"
		)
			return next();

		const user = req.session.user;
		if (!user) return next();

		return res.redirect("/");
	});

	app.use(async (req, res, next) => {
		if (req.originalUrl != "/signout") return next();

		const user = req.session.user;
		if (user) return next();

		return res.redirect("/");
	});

	// redirects customer specific routes
	app.use(async (req, res, next) => {
		if (
			req.originalUrl != "/customers/cart" &&
			req.originalUrl != "/customers/wishlist" &&
			req.originalUrl != "/customers/orders" &&
			req.originalUrl != "/customers/checkout" &&
			!req.originalUrl.match(/^\/customers\/orders\/.+$/)
		)
			return next();

		const user = req.session.user;
		if (!user) return res.redirect("/customers/login");
		if (user.role != "customer") return res.redirect("/");

		return next();
	});

	// redirects seller specific routes
	app.use(async (req, res, next) => {
		if (
			req.originalUrl != "/sellers/listings" &&
			req.originalUrl != "/sellers/orders" &&
			!req.originalUrl.match(/^\/sellers\/listings\/.+$/) &&
			!req.originalUrl.match(/^\/sellers\/orders\/.+$/)
		)
			return next();

		const user = req.session.user;
		if (!user) return res.redirect("/sellers/login");
		if (user.role != "seller") return res.redirect("/");

		return next();
	});
};

export default applyMiddlewares;
