const { connect, connection } = require("mongoose");
const { dbString } = require("../config");

const connectToDb = () => {
  connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  var db = connection;
  db.on("error", console.error.bind(console, "Error connecting to MongoDB"));
  db.once("open", () => {
    console.log("Connected to MongoDB successfully");
  });
};

module.exports = { connectToDb };
