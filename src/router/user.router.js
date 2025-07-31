const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);

  await userModel.create({
    username,
    email,
    password: hashedPass,
  });

  res.redirect("/users/login");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.redirect("/users/register");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.redirect("/users/login");
  }

  const token = jwt.sign({ id: user._id, username: user.username }, "hfdskjasfgksjdfgfdalsdf");
  res.cookie("token", token);
  res.redirect("/home");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/users/login");
});

module.exports = router;
