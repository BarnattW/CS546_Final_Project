import express from "express";
import routeConfig from "./routes/index.js";
import exphbs from "express-handlebars";
import applyMiddlewares from "./utils/middleware.js";
import session from "express-session";

const app = express();

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
	session({
		name: "AuthenticationState",
		secret: "some secret string!",
		resave: false,
		saveUninitialized: false,
	})
);

applyMiddlewares(app);

routeConfig(app);
// app.use('/customer', customerRoutes);

app.listen(3000, () => {
	console.log("Server listening on port 3000");
});
