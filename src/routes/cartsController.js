const mongoose = require("mongoose");
const router = require("express").Router();
const cartsModel = require("../models/cartsModel");
require("../models/usersModel");

/**
 * Get user cart
 */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send("Missing user id");
    }

    const results = await cartsModel
      .findOne({ userId: { _id: userId } }, "userId products")
      .populate("products.product", "id title price")
      .populate("userId", "username")
      .exec();

    return res.send(results);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

/**
 * Add to cart (update quantity if item in cart)
 */
router.put("/", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.query;

    if (!userId || !productId || !quantity) {
      return res.sendStatus(400);
    }

    if (
      isNaN(quantity) ||
      !Number.isInteger(parseFloat(quantity)) ||
      parseInt(quantity) < 1
    ) {
      return res.status(400).send("Invalid quantity");
    }

    let cart = await cartsModel
      .findOne({ userId: { _id: userId } })
      .populate("products.product", "id title price")
      .exec();

    const productIndex = cart.products.findIndex((p) => {
      return p.product._id.toString() === productId;
    });

    if (productIndex > -1) {
      let cartItem = cart.products[productIndex];
      cartItem.quantity = parseInt(quantity);
      cart.products[productIndex] = cartItem;
    } else {
      const newOrder = {
        product: mongoose.Types.ObjectId(productId),
        quantity: parseInt(quantity),
      };
      cart.products.push(newOrder);
    }
    await cart.save();

    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

/**
 * Delete from cart
 */
router.delete("/", async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (!userId || !productId) {
      return res.sendStatus(400);
    }

    let cart = await cartsModel
      .findOne({ userId: { _id: userId } })
      .populate("products.product", "id title price")
      .exec();

    const productIndex = cart.products.findIndex((p) => {
      return p.product._id.toString() === productId;
    });

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();

      return res.sendStatus(200);
    } else {
      return res.status(400).send("Item not in cart");
    }
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
