const { Schema, model } = require("mongoose");

const usersSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    firstname: String,
    lastname: String,
  },
  phone: String,
});

module.exports = model("users", usersSchema, "users");
