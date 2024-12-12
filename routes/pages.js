import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
	try {
		res.render("home");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.get("/signin", async (req, res) => {
	try {
		res.render("signinuser");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.get("/signup", async (req, res) => {
	try {
		res.render("signupuser");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.get("/signout", async (req, res) => {
	try {
		res.render("signoutuser");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.get("/checkout", async (req, res) => {
	try {
		res.render("checkout");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

export default router;
