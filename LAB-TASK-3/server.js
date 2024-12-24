//requiring all modules to use
const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

const app = express();
// const bodyParser = require('body-parser');

app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// Use body-parser to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
let productsRouter = require("./routes/admin/products.router");

app.use(productsRouter);

app.get('/admin/dashboard', (req, res) => {
  res.render('dashboard'); // Renders the admin-dashboard.ejs file
  // Or render an EJS file if using templates
  // res.render('dashboard');
});


// MongoDB Connection
require('dotenv').config();
const connectionstring = process.env.MONGO_URI;

mongoose.connect(connectionstring)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.get("/", (req, res) => {
  res.render("WebsitePages/ClientSide/landingpage");
});

app.get("/placeOrder", async (req, res) => {
  const products = require("./models/product.model");
  const categories = require("./models/category.model");

  try {
    const product = await products.find();
    const category=await categories.find();
    res.render("WebsitePages/ClientSide/placeOrder", { product,category ,layout:"productsLayout.ejs"});
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});

// app.get("/login", (req, res) => {
//   res.render("WebsitePages/ClientSide/loginsignup",{layout:false});
// });

// Start the server
const PORT=5131;
app.listen(PORT, () => {
  console.log(`Server started at location: ${PORT}`);
});

