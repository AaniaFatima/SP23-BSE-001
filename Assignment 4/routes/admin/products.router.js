const mongoose = require("mongoose");
const express = require("express");
let router = express.Router();
let multer = require("multer");
let Product = require("../../models/product.model");
let Category = require("../../models/category.model");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });
// router.get//('/dashboard', (req, res) => {
//     res.render//('WebsitePages/AdminPanel/dashboard'); // Renders the admin-dashboard.ejs file
//     // Or render an EJS file if using templates
//     // res.render('dashboard');
//   });
// Admin Dashboard Route
router.get("/dashboard", async (req, res) => {
    let products = await Product.find();
    let categories = await Category.find();
    res.render("WebsitePages/AdminPanel/dashboard", { layout: "adminLayout.ejs", products,categories });
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Example validation logic
    if (email === 'admin@example.com' && password === 'password123') {
        return res.redirect('./views/adminLayout'); // Redirect to dashboard
    } else {
        return res.status(401).send('Invalid email or password');
    }
});

// Product Routes
router.get("/products", async (req, res) => {
    let products = await Product.find();
    res.render("WebsitePages/AdminPanel/products", { layout: "adminLayout.ejs", products });
});

router.get("/products/create", (req, res) => {
    res.render("WebsitePages/AdminPanel/createProduct", { layout: "adminLayout.ejs" });
});

router.post("/products/create", upload.single("file"), async (req, res) => {
    let product = new Product(req.body);
    if (req.file) product.picture = req.file.filename;
    product.isFeatured = Boolean(req.body.isFeatured);
    await product.save();
    res.redirect("/admin/products");
});

router.get("/products/edit/:id", async (req, res) => {
    let product = await Product.findById(req.params.id);
    res.render("WebsitePages/AdminPanel/editProduct", { layout: "adminLayout.ejs", product });
});

router.post("/products/edit/:id", async (req, res) => {
    let product = await Product.findById(req.params.id);
    product.title = req.body.title;
    product.source = req.body.source;
    product.description = req.body.description;
    product.price = req.body.price;
    product.isFeatured = Boolean(req.body.isFeatured);
    await product.save();
    return res.redirect("/admin/products");
});

router.get("/products/delete/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/products");
});

// Category Routes
router.get("/viewcatagories", async (req, res) => {
    let categories = await Category.find();
    res.render("WebsitePages/AdminPanel/category", { layout: "adminLayout.ejs", categories });
});

// Route for creating a category (POST)
router.post("/products/createCategory", async (req, res) => {
    let category = new Category(req.body);
    await category.save();
    res.redirect("/admin/viewcatagories"); // Redirect to the categories page after creating
});

// Route for deleting a category
router.get("/categories/delete/:id", async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    return res.redirect("/admin/viewcatagories"); // Redirect back to the categories page after deletion
});

// Route for editing a category (GET)
router.get("/categories/edit/:id", async (req, res) => {
    let category = await Category.findById(req.params.id);
    res.render("WebsitePages/AdminPanel/editCategory", { layout: "adminLayout.ejs", category });
});

// Route for updating a category (POST)
router.post("/categories/edit/:id", async (req, res) => {
    let category = await Category.findById(req.params.id);
    category.categoryName = req.body.categoryName;
    await category.save();
    return res.redirect("/admin/viewcatagories"); // Redirect back to the categories page after update
});

// Route for creating a category (GET)
router.get("/products/createCategory", (req, res) => {
    res.render("WebsitePages/AdminPanel/createCategory", { layout: "adminLayout.ejs" });
});

module.exports = router;
