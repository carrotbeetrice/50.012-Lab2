const router = require("express").Router();
const usersModel = require("../models/usersModel");
const cartsModel = require("../models/cartsModel");
const { apiKey } = require("../config");

/**
 * Register new user
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, firstname, lastname, phone } = req.body;

    // Check for required fields
    if (!username || !password || !email) {
      return res.status(400).send("Missing required fields");
    }

    // Check if user already exists
    const existingUser = await usersModel
      .findOne({ $or: [{ email }, { username }] })
      .exec();

    if (existingUser) {
      let message =
        existingUser.email === email
          ? "Account with this email already exists"
          : "Username already taken";
      return res.status(400).send(message);
    }

    const newUser = await usersModel.create({
      email,
      username,
      password,
      phone,
      name: { firstname, lastname },
    });

    // Create new cart for user
    await cartsModel.create({
      userId: newUser._id,
      products: [],
    });

    return res.status(201).send(newUser._id);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

/**
 * Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.sendStatus(400);

    const userData = await usersModel
      .findOne({ username, password }, "name email username phone")
      .exec();

    if (userData) {
      return res.send({ userData, apiKey });
    } else {
      return res.status(400).send("Invalid credentials");
    }
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
