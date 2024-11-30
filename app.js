import express from "express";
import routeConfig from "./routes/index.js";

const app = express();

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routeConfig(app);

app.listen(3000, () => {
	console.log("Server listening on port 3000");
});