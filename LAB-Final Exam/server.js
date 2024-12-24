//requiring all modules to use
const express = require("express");
//express session
const session = require('express-session'); // Import session

const path = require('path');


const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

const app = express();
// const bodyParser = require('body-parser');

app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.static("uploads"));
//setting view engine to ejs
app.set("view engine", "ejs");

app.set('views', path.join(__dirname, 'views'));

// Use express-session to store cart items in the session
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
// Use body-parser to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
let productsRouter = require("./routes/admin/products.router");

app.use("/admin",productsRouter);





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
  const Product = require("./models/product.model");
  const Category = require("./models/category.model");

  const searchQuery = req.query.searchQuery || ''; // Extract the search query from the URL
  const isFeatured = req.query.isFeatured; // Extract the featured filter (true or false)
  const sortBy = req.query.sortBy; // Extract the sorting option
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = 8; // Number of products per page
  const skip = (page - 1) * limit; // Skip the previous pages' items

  try {
      // Define search options
      const searchOptions = {};

      // Add search query filter if present
      if (searchQuery) {
          searchOptions.$or = [
              { title: new RegExp(searchQuery, 'i') },
              { description: new RegExp(searchQuery, 'i') },
          ];
      }

      // Add featured filter if present
      if (isFeatured !== undefined) {
          searchOptions.isFeatured = isFeatured === 'true'; // Convert to boolean
      }

      // Determine the sorting order based on the "sortBy" parameter
      let sortOptions = {};
      if (sortBy === 'highToLow') {
          sortOptions = { price: -1 }; // Sort by price in descending order (high to low)
      } else if (sortBy === 'lowToHigh') {
          sortOptions = { price: 1 }; // Sort by price in ascending order (low to high)
      }

      // Fetch filtered, sorted products with pagination
      const products = await Product.find(searchOptions)
          .sort(sortOptions)
          .skip(skip)
          .limit(limit);

      // Get total product count for pagination
      const totalProducts = await Product.countDocuments(searchOptions);
      const totalPages = Math.ceil(totalProducts / limit);

      // Fetch all categories
      const categories = await Category.find();

      // Pass data to the template
      res.render("WebsitePages/ClientSide/placeOrder", {
          product: products,
          category: categories,
          searchQuery,
          isFeatured,
          sortBy,
          currentPage: page,
          totalPages,
          layout: "productsLayout.ejs",
      });
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Error fetching products");
  }
});




// Route to display the cart (addToCart.ejs)




// app.post('/addToCart', (req, res) => {
//   // Handle the form submission and add the product to the cart
//   res.redirect//('/addToCart');  // Example of redirecting after adding an item
// });

// app.get("/login", (req, res) => {
//   res.render("WebsitePages/ClientSide/loginsignup",{layout:false});
// });

// Start the server

const cartRoutes = require("./routes/cart");
app.use("/cart", cartRoutes);

const wishlistRoutes = require("./routes/wishlist");
app.use("/wishlist", wishlistRoutes);


const PORT=5130;
app.listen(PORT, () => {
  console.log(`Server started at location: ${PORT}`);
});

