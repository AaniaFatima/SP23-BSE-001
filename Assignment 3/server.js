const express = require("express")
const expressLayouts = require("express-ejs-layouts")

const app = express()

//we set EJS as the template engine
app.set('view engine','ejs')

// //use express-ejs-layouts
app.use(expressLayouts)

// // Specify the layout file (optional, defaults to `views/layout.ejs`)
app.set("layout", "layouts/main");

/*so serving static files from the public folder or directory */
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
    res.render("khaadi", { title: "Khaadi Pakistan - Official Website " });
  });



app.listen(3000)
