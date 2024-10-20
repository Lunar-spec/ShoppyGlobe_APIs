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