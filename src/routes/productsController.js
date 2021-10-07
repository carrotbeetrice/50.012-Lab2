const router = require("express").Router();
// const categoriesModel = require("../models/categoriesModel");
const productsModel = require("../models/productsModel");

/**
 * Get all products
 */
router.get("/", async (req, res) => {
  try {
    const { sortBy, count, offset } = req.query;

    const filterOptions = {
      skip: offset ? parseInt(offset) : 0,
      sort: sortBy ?? "",
      limit: count ? parseInt(count) : 0,
    };

    const results = await productsModel
      .find({})
      .setOptions(filterOptions)
      .populate("category")
      .exec();

    res.send(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

/**
 * Get all product categories
 */
// router.get("/categories", (req, res) => {
//   categoriesModel.find({}).exec((err, result) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

module.exports = router;
