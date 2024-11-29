import { Router } from "express";
import { checkId } from "../utils/checks";
import { customersData } from "../data";

const router = Router();

router.route("/:id").get(async (req, res) => {
	try {
		req.params.id = checkId(req.params.id);
	} catch (e) {
		console.log(e);
		return res.json({ error: e });
	}

	try {
		const customer = customersData.getCustomerById(req.params.id);
		return res.json(customer);
	} catch (e) {
		console.log(e);
		res.status(404).json({ error: "Customer not found!" });
	}
});

export default router;
