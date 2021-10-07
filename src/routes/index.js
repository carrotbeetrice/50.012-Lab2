module.exports = (app) => {
  app.use("/users", require("./usersController"));
  app.use("/", require("./rootController"));
  app.use("/products", require("./productsController"));
  app.use("/carts", require("./cartsController"));
};
