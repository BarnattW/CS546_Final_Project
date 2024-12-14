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

		const user = req.session.user;
	try {
		if (!user) throw `Session user not found. Login again.`;
	} catch (e) {
		return res.status(401).render("customerlogin", { error: e });
	}
	try {
		res.render("checkout");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.get("/customerbrowselistings", async (req, res) => {
	try {
		res.render("customerbrowselistings");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.get("/customercart", async (req, res) => {
	try {
		res.render("customercart");
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.post("/checkout", (req, res) => {
	const user = req.session.user;
	try {
		if (!user) throw `Session user not found. Login again.`;
	} catch (e) {
		return res.status(401).render("customerlogin", { error: e });
	}
	const { fullName, address, city, state, zipCode, country } = req.body;
  
	res.redirect("/payment");
  });
  

router.route("/payment").get(async (req, res) => {
	const user = req.session.user;
	try {
		if (!user) throw `Session user not found. Login again.`;
	} catch (e) {
		return res.status(401).render("customerlogin", { error: e });
	}

	try {
		res.render("payment", { user: req.session.user });
	} catch (e) {
		return res.status(404).json({ error: e });
	}
});

router.post("/process-payment", (req, res) => {
	const { cardNumber, expiryDate, cvv } = req.body;
  
	if (!cardNumber || !expiryDate || !cvv) {
	  return res.status(400).send("All payment fields are required.");
	}
  
	const cardNumberPattern = /^\d{16}$/;
	const cardNumberPattern2 = /^\d{15}$/; 
	const expiryDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
	const cvvPattern = /^\d{3}$/; 
  
	if (!cardNumberPattern.test(cardNumber) || !cardNumberPattern2.test(cardNumber )) {
	  return res.status(400).send("Invalid card number. It should be 16/15 digits.");
	}
  
	if (!expiryDatePattern.test(expiryDate)) {
	  return res.status(400).send("Invalid expiry date. Use MM/YY format.");
	}
  
	if (!cvvPattern.test(cvv)) {
	  return res.status(400).send("Invalid CVV. It should be 3 digits.");
	}
  

	console.log("Processing payment with details:", { cardNumber, expiryDate, cvv });

	res.render("payment-success", {
	  pageTitle: "Payment Successful",
	  message: "Thank you! Your payment has been processed successfully.",
	});
  });
  

export default router;
