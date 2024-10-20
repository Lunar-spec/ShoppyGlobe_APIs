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