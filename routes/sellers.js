import { Router } from 'express';
const router = Router();
import * as sellersData from '../data/seller.js';
import * as validation from '../utils/checks.js';

// GET

router
  .route('/')
  .get(async (req, res) => {
    try {
      const sellersList = await sellersData.getAllSellers();
      return res.render(sellersList);
    } catch (e) {
      return res.status(500).render('error', { error: e });
    }
  })
  .post(async (req, res) => {
    const requestBodyData = req.body;

    if (!requestBodyData || Object.keys(requestBodyData).length === 0) {
      return res
        .status(400)
        .render('error', { error: 'Could not get Request Body.' });
    }
    try {
      // Validation of Request Body Data

      requestBodyData.username = validation.checkString(
        requestBodyData.username
      );
      requestBodyData.password = validation.checkString(
        requestBodyData.password
      );
      requestBodyData.name = validation.checkString(requestBodyData.name);
      requestBodyData.town = validation.checkString(requestBodyData.town);
    } catch (e) {
      return res.status(500).render('error', { error: e });
    }

    //

    try {
      const { username, password, name, town } = requestBodyData;

      const newSeller = await sellersData.createSeller(
        username,
        password,
        name,
        town
      );
    } catch (e) {
      return res.status(500).render('error', { error: e });
    }
  });

// Export Router

export default router;
