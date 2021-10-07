const { Schema, model } = require("mongoose");

const cartProductSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "products" },
  quantity: {
    type: Number,
    min: [1, "Invalid quantity"],
  },
});

const cartsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  products: [cartProductSchema],
});

module.exports = model("carts", cartsSchema, "carts");
