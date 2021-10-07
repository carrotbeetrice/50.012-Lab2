require("dotenv").config();

// if (process.env.NODE_ENV === "dev") {
//   const envFound = dotenv.config();
//   if (envFound.error) throw new Error("Could not find .env file");
// }

module.exports = {
  dbString: process.env.DB_STRING,
  apiKey: process.env.API_KEY,
  port: process.env.PORT,
};
