const express = require("express");
const ImageKit = require("imagekit");
const multer = require("multer");
const productModel = require("../models/product.model");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Detail view
router.get("/detail/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await productModel.findById(productId);
  res.render("productDetail.ejs", { product });
});

// Update form view
router.get("/update/:id", async (req, res) => {
  const productId = req.params.id;
  const product = await productModel.findById(productId);
  res.render("productUpdate.ejs", { product });
});

// Handle update
router.post("/update/:id", upload.single("image"), async (req, res) => {
  const { title, content, categories } = req.body;
  const productId = req.params.id;

  const categoryArray = categories ? categories.split(",").map(cat => cat.trim()) : [];

  const updateData = {
    title,
    content,
    categories: categoryArray,
  };

  if (req.file) {
    const imagekit = new ImageKit({
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY,
      urlEndpoint: process.env.URLENDPOINT,
    });

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      isPublished: true,
      isPrivateFile: false,
    });

    updateData.image = result.url;
  }

  await productModel.findByIdAndUpdate(productId, updateData);
  res.redirect(`/products/detail/${productId}`);
});

// Delete post
router.get("/delete/:id", async (req, res) => {
  const productId = req.params.id;
  await productModel.findByIdAndDelete(productId);
  res.redirect("/");
});

// Form page
router.get("/add", (req, res) => {
  res.render("productForm");
});

// Handle new post
router.post("/add", upload.single("image"), async (req, res) => {
  const { title, content, categories } = req.body;

  const categoryArray = categories ? categories.split(",").map(cat => cat.trim()) : [];

  const imagekit = new ImageKit({
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
    urlEndpoint: process.env.URLENDPOINT,
  });

  const result = await imagekit.upload({
    file: req.file.buffer,
    fileName: req.file.originalname,
    isPublished: true,
    isPrivateFile: false,
  });

  const product = await productModel.create({
    title,
    content,
    categories: categoryArray,
    image: result.url,
  });

  res.redirect("/home");
});

module.exports = router;
