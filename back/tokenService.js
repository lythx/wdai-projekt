const jwt = require("jsonwebtoken")

const tokenHeaderKey = "token"
const jwtSecretKey = "sigma_algebra"

function validateAndParseToken(req) {
  try {
    const token = req.header(tokenHeaderKey)
    const verified = jwt.verify(token, jwtSecretKey)
    if (verified) {
      return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

function generateToken(userId) {
  const data = {time: Date.now(), userId}
  return jwt.sign(data, jwtSecretKey);
}

module.exports = {validateAndParseToken, generateToken}
