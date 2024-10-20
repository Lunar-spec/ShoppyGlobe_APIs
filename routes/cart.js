import express from 'express';
import { cartController } from '../controllers/controllers.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, cartController.addToCart);
router.put('/:id', auth, cartController.updateCart);
router.delete('/:id', auth, cartController.removeFromCart);

export default router;