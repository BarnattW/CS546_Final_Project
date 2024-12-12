import { Router } from 'express';
import { sellersData } from '../data/index.js';
import * as validation from '../utils/checks.js';

const router = Router();

// /sellers/login

router
  .route('/login')
  .get(async (req, res) => {
    try {
      return res.render('sellerlogin', { user: req.session.user });
    } catch (e) {
      return res.status(500).render('error', { error: e });
    }
  })
  .post(async (req, res) => {
    const sellerData = req.body;

    if (!sellerData || Object.keys(sellerData).length === 0) {
      return res
        .status(400)
        .render('error', { error: 'There are no fields in the request body' });
    }

    const { username, password } = sellerData;

    try {
      sellerData = validation.sanitizeObject(sellerData);
      sellerData.username = validation.checkString(username, 'Seller Username');
      sellerData.password = validation.checkString(password, 'Seller Password');
      validation.checkStringLength(username, 5, 20);
      validation.checkStringLength(password, 8);
      sellerData.username = sellerData.username.toLowerCase();
    } catch (e) {
      return res.status(500).render('error', { error: e });
    }

    try {
      const user = await sellersData.loginSeller(username, password);
      if (user) {
        req.session.user = {
          _id: user._id,
          username: user.username,
          role: 'seller',
        };
      }
      res.redirect('/home');
    } catch (e) {
      return res.status(500).render('error', { error: e });
    }
  });
// SIGNUP

router.route('/signup ').post(async (req, res) => {
  const requestBodyData = req.body;

  if (!requestBodyData || Object.keys(requestBodyData).length === 0) {
    return res
      .status(400)
      .render('error', { error: 'Could not get Request Body.' });
  }

  try {
    requestBodyData.username = validation.checkString(
      requestBodyData.username,
      "Seller's Username"
    );
    requestBodyData.password = validation.checkString(
      requestBodyData.password,
      "Seller's Password"
    );
    requestBodyData.name = validation.checkString(
      requestBodyData.name,
      'Sellers Name'
    );
    requestBodyData.town = validation.checkString(
      requestBodyData.town,
      "Seller's Town"
    );
  } catch (e) {
    return res.status(500).render('error', { error: e });
  }

  try {
    const { username, password, name, town } = requestBodyData;

    const newSeller = await sellersData.createSeller(
      username,
      password,
      name,
      town
    );

    return res.status(200).render('seller', { seller: newSeller }); // Not sure if this is the correct way to render the seller
  } catch (e) {
    return res.status(500).render('error', { error: e });
  }
});

// Export Router

export default router;
