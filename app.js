import express from "express";
import routeConfig from "./routes/index.js";
import exphbs from "express-handlebars";

const app = express();

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

routeConfig(app);
// app.use('/customer', customerRoutes);

app.listen(3000, () => {
	console.log("Server listening on port 3000");
});