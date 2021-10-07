const express = require("express");
const cors = require("cors");
const { auth } = require("./middleware");

const { connectToDb } = require("./db");

const { port } = require("./config");

const startServer = () => {
  const app = express();

  // Middleware
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use(auth);

  // Use app routes
  require("./routes")(app);

  connectToDb();
  require("./models")();

  app.listen(port, () => {
    console.log(`API listening at port ${port}`);
  });
};

startServer();
