const { Console } = require("winston/lib/winston/transports");
const logger = require("./logger");

function validateToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get(`Authorization`);

  console.log(apiToken, 'API')
  console.log(authToken, "AUTH")

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: `Unauthorized Request` });
  }
  next();
}

module.exports = validateToken;

// comment