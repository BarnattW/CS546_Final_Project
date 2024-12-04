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
      return res.json(sellersList);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {});

export default router;
