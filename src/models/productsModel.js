const { Schema, model } = require("mongoose");

const productsSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: "categories",
  },
  image: String,
  rating: {
    rate: Number,
    count: Number,
  },
});

module.exports = model("products", productsSchema, "products");
