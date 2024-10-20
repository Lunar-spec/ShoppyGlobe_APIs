// controllers/authController.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authController = {
    async register(req, res) {
        try {
            const { email, password, name } = req.body;

            // Check if user exists
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Error creating user' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }

            // Check password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Error logging in' });
        }
    },
};

// controllers/productController.js
export const productController = {
    async getAllProducts(req, res) {
        try {
            const products = await prisma.product.findMany({
                include: { category: true }
            });
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching products' });
        }
    },

    async getProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await prisma.product.findUnique({
                where: { id },
                include: { category: true }
            });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching product' });
        }
    },
};

// controllers/cartController.js
export const cartController = {
    async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user.id;

            // Check if product exists and has enough stock
            const product = await prisma.product.findUnique({ where: { id: productId } });
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            if (product.stock < quantity) {
                return res.status(400).json({ error: 'Insufficient stock' });
            }

            // Get or create cart
            let cart = await prisma.cart.findFirst({ where: { userId } });
            if (!cart) {
                cart = await prisma.cart.create({ data: { userId } });
            }

            // Add or update cart item
            const cartItem = await prisma.cartItem.upsert({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId,
                    },
                },
                update: {
                    quantity: { increment: quantity },
                },
                create: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });

            res.status(201).json(cartItem);
        } catch (error) {
            res.status(500).json({ error: 'Error adding to cart' });
        }
    },

    async updateCart(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const userId = req.user.id;

            const cartItem = await prisma.cartItem.update({
                where: {
                    id,
                    cart: {
                        userId,
                    },
                },
                data: { quantity },
            });

            res.json(cartItem);
        } catch (error) {
            res.status(500).json({ error: 'Error updating cart' });
        }
    },

    async removeFromCart(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            await prisma.cartItem.delete({
                where: {
                    id,
                    cart: {
                        userId,
                    },
                },
            });

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error removing from cart' });
        }
    },
};