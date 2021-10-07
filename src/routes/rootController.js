let router = require("express").Router();
const fs = require("fs");

const gifPath = __dirname + "/../../public/authorized.gif";

router.get("/", (req, res) => {
  fs.readFile(gifPath, (err, data) => {
    if (err) {
      console.error(err);
      res.send("Hello there!");
    } else {
      res.writeHead(200, { "Content-Type": "image/gif" });
      res.end(data, "binary");
    }
  });
});

module.exports = router;
