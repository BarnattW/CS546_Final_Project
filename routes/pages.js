import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
	try {
		return res.render("home", { user: req.session.user });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.get("/signin", async (req, res) => {
	try {
		return res.render("loginuser");
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.get("/signup", async (req, res) => {
	try {
		return res.render("signupuser");
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.get("/signout", async (req, res) => {
	try {
		if (req.session) {
			req.session.destroy();
		}
		return res.render("signoutuser");
	} catch (e) {
		return res.status(500).json({ error: e });
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
