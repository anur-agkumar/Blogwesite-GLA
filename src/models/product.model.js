const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
   title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String
    },
    categories: {
        type: [String], // Array to store multiple categories
        default: []
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const productModel = mongoose.model("product", productSchema)

module.exports = productModel