const express = require("express");
const router = express.Router();
const Product = require('../models/product.model');
const Order = require("../models/Order");


router.get("/add/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            req.flash("error_msg", "Product not found");
            return res.redirect("/");
        }

        // Initialize cart in session if it doesn't exist
        if (!req.session.cart) req.session.cart = [];

        // Check if product is already in the cart
        const existingProduct = req.session.cart.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1; // Increment quantity
        } else {
            console.log(product.name);
            // Add new product to the cart
            req.session.cart.push({
                id: product._id,
                name: product.title,
                price: product.price, // Assuming you have an image field
                quantity: 1,
            });
        }
        console.log("Product added to cart!")
        res.redirect("/cart");
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.redirect("/");
    }
});
// Render Cart Page
router.get("/", (req, res) => {

    const cart = req.session.cart || [];
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    console.log("cart:" + cart);

    res.render("cart/cart", { cart, totalPrice });
});
router.get("/checkout", (req, res) => {
    res.render("cart/checkout", { user: req.session.user });
});


router.post("/checkout", async (req, res) => {
    try {
        const { name,email,shippingAddress, phone } = req.body;

        // Assuming req.session.cart contains cart items and user is logged in
        const cart = req.session.cart || [];
       

        const orderTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        if (cart.length === 0) {
            return res.status(400).send("Your cart is empty");
        }
        console.log("Cart 1" + cart[0]);

        const orderItems = cart.map(item => ({

            productId: item.id, // Ensure this exists in the cart data
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        }));
        orderItems.forEach(element => {
            console.log(element);
        });


        const newOrder = new Order({
            name,
            email,
            items: orderItems,
            shippingAddress,
            phone,
            orderTotal: orderTotal + 190,
        });

        await newOrder.save();

        // Clear the cart
        req.session.cart = [];

        res.redirect("/cart/confirm");
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to place order" });
    }
});
router.get("/confirm", (req, res) => {
    res.render("cart/confirm", { message: "Your order has been placed successfully!" });
});



// Apply this to the relevant routes

router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    // Access the cart from the session
    const cart = req.session.cart || [];

    // Find the item in the cart and remove it
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1); // Remove item from cart

        // Update session cart and recalculate total
        req.session.cart = cart;
        const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.json({ success: true, newTotal });
    } else {
        res.json({ success: false, message: "Item not found in the cart" });
    }
});
module.exports = router;