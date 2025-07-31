const express = require("express");
const indexRouter = require("./router/index.router");
const productRouter = require("./router/product.router");
const userRouter = require("./router/user.router");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const path = require("path");
const app = express();

app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect root to register
app.get("/", (req, res) => {
  res.redirect("/users/register");
});

// Routes
app.use("/home", indexRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);

module.exports = app;
