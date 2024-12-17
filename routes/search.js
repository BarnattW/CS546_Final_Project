import { Router } from 'express';
const router = Router();
import * as validation from '../utils/checks.js';
import * as searchFunction from '../data/search.js';
import * as sellersData from '../data/seller.js';

router
	.route("/")
	.get(async (req, res) => {
		try {
			const searchResults = await sellersData.getAllListings();

			return res.render("search", { searchResults, user: req.session.user });
		} catch (e) {
			return res.status(404).json({ error: e });
		}
	})
	.post(async (req, res) => {
		let searchQuery = req.body.query;

		try {
			// Call the search function
			// const searchResults = await searchFunction(searchQuery);
			// return res.render('search', { searchResults });

			const searchResults = await searchFunction.searchListing(searchQuery);
			return res.render("search", { searchResults, user: req.session.user });
		} catch (e) {
			console.log(e);
			return res.status(404).json({ error: e });
		}
	});

export default router;
