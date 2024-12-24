const express = require("express");
const router = express.Router();
const Product = require('../models/product.model');


router.get("/", async (req, res) => {
    try {
        // Fetch products where `wishlist` is true
        const products = await Product.find({ wishlist: true });

        res.render("cart/wishlist", {
            message: products.length > 0 ? null : "Your wishlist is empty.",
            products, // Send the products to the wishlist.ejs view
        });
    } catch (error) {
        console.error("Error fetching wishlist products:", error);
        res.status(500).render("cart/wishlist", {
            message: "Server error.",
            products: [],
        });
    }
});


router.get("/add/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Set the wishlist boolean of the product to true
        product.wishlist = true;
        await product.save();

        res.redirect("/wishlist");
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/delete/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Set the wishlist boolean of the product to false
        product.wishlist = false;
        await product.save();

        res.status(200).json({ message: "Product removed from wishlist", product });
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;

