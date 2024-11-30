import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
	try {
		res.render("home");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.get("/login", async (req, res) => {
	try {
		res.render("customer/createlogin");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

export default router;
