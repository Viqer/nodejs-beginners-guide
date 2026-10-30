/*
middleware/auth.js
the bouncer

job: read the login token, work out who sent it, and let them in
called by: routes/user.js (router.use(authenticateToken))
calls: jsonwebtoken, models/Users.js
read next: middleware/encrypt.js

the client sends the token it got at login in a header:
Authorization: Bearer <token>
this file reads that header and checks the token.
*/


// 1. imports

/*
loads .env right here, so this file has its own settings even if loaded early.
*/
require("dotenv").config();
const jwt = require("jsonwebtoken");   // checks tokens
const User = require("../models/Users");   // so we can look the user up in the database


// 2. the middleware

/*
same shape as every middleware: (req, res, next)
next() = let them through. sending a response = stop here.
*/
async function authenticateToken(req, res, next) {

  // try/catch: anything that throws below lands in catch at the bottom
  try {

    /*
    headers are extra info sent along with a request.
    the header looks like: "Bearer abc123"
    split(' ') cuts it at the space into ["Bearer", "abc123"].
    [1] picks the second part, the token itself.
    authHeader && ... makes sure there is a header before we cut it.
    */
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // no token, no entry. 401 = unauthorized.
    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    /*
    jwt.verify(token, secret) does two jobs:
    it checks the token wasn't faked or changed, and that it hasn't expired.
    the secret must be the same one that signed the token at login.
    if the token is bad, verify throws, and we jump to catch.
    on success it hands back what we stored inside at login: { id, username }.
    */
    // Use id instead of _id for JWT payload
    const getTokenData = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    // read the id out of the token. || tries id first, then _id.
    const userId = getTokenData.id || getTokenData._id;

    // 403 = forbidden. the token has no usable id inside.
    if (!userId) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    /*
    the token can be valid while the user is gone, so check the database.
    findById returns the user, or null if they were deleted.
    */
    const isUserExist = await User.findById(userId);
    if (!isUserExist) {
      return res.status(404).json({ message: "User not found" });
    }

    /*
    this is the important line.
    req is passed along to every step after this one.
    attaching the user to req means later code can read it.
    that's why routes/user.js can use req.user._id.
    */
    req.user = isUserExist;

    next();   // all checks passed. on to the next step.

  } catch (error) {
    // verify failing, or the database failing, ends up here
    console.error("Token verification error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}


// 3. export

// wrapped in an object so it can be picked with { authenticateToken }
module.exports = {
  authenticateToken
}


/*
the journey of a token

1. login:    routes/auth.js makes the token and sends it to the client
2. later:    the client sends it back in the Authorization header
3. here:     this file checks it and sets req.user
4. after:    routes and controllers use req.user

status codes in this file
401  no token
403  token has no id
404  user no longer exists
500  something threw (a bad token lands here too)
*/