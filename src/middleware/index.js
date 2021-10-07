const fs = require("fs");
const apiKey = require("../config").apiKey;

const gifPath = __dirname + "/../../public/unauthorized.gif";

const auth = (req, res, next) => {
  const requestPath = req.path;

  if (requestPath.includes("/users")) next();
  else {
    const clientKey = req.headers["api-key"];

    if (clientKey) {
      if (clientKey === apiKey) next();
      else res.sendStatus(403);
    } else {
      fs.readFile(gifPath, (err, data) => {
        if (err) {
          console.error(err);
          res.sendStatus(401);
        } else {
          res.writeHead(401, { "Content-Type": "image/gif" });
          res.end(data, "binary");
        }
      });
    }
  }
};

module.exports = { auth };
