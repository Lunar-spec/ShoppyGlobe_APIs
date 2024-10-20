import express from 'express';
import { productController } from '../controllers/productController.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

export default router;