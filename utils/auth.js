const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const jwtSecret = process.env.JWTSECRET;

/**
 * Authorize middleware to be used on the routes to be secured
 */

const authorize = (req, res, next) => {
  console.log("authorize() middleware");
  var token = req.get("authorization");
  if (!token) return res.status(401).send("You are not authenticated.");

  jwt.verify(token, jwtSecret, (err, token) => {
    if (err) return res.status(401).send(err.message);
    const user = User.find({ email: token.email });
    if (!User) return res.status(401).send("User not found.");
    // authorization is completed, call the next middleware
    next();
  });
};

const LIFETIME_JWT = 24 * 60 * 60 * 1000; // in seconds : 24 * 60 * 60 * 1000 = 24h
/**
 * Example of how to use an asynchronous function which uses callback (sign() is asynchronous if a callback is supplied))
 * @param {*} param0
 * @param {*} callback
 */
const signAsynchronous = ({ email }, onSigningDoneCallback) => {
  const exp = Date.now() + LIFETIME_JWT;
  console.log("sign():", { email }, email, { ...email });
  jwt.sign({ email }, jwtSecret, { expiresIn: LIFETIME_JWT }, (err, token) => {
    return onSigningDoneCallback(err, token);
  });
};

module.exports = { authorize, signAsynchronous };
