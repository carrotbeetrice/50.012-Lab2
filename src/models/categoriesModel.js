const { Schema, model } = require("mongoose");

const categoriesSchema = new Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = model("categories", categoriesSchema, "categories");
