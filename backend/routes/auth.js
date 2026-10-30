/*

routes/auth.js
login and signup

this file is probably the hardest to understand since there is a whole lot of shennanigans
going on.
just give it a slow read! and don't get scared by the size!

job: let people register, log in, and get a token back
called by: routes/index.js
calls: models/Users.js, bcryptjs, jsonwebtoken
read next: routes/user.js

a route is: router.METHOD('/path', handler)
the handler gets req (what came in) and res (what goes out).
the full URL also depends on how routes/index.js mounts this file.
*/


const express = require('express');
const router = express.Router();

const User = require('../models/Users');

/*
bcryptjs scrambles passwords (hashing) so we never store the real one.
jsonwebtoken makes the token that proves "this person logged in".
*/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


/*
the secret signs every token. anyone with it can fake logins.
|| picks the first value that exists, left to right:
JWT_SECRET_KEY from .env, then JWT_SECRET, then the fallback text.
the fallback is only for local dev. set a real one in .env for anything public.
*/
const JWT_SECRET = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET || 'dev_secret_key';


/*
POST /login
the client sends { username, password } as JSON.
express.json() in server.js is what puts it on req.body.
async/await: await pauses until the database or bcrypt finishes.
*/
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(401).json({ message: 'Invalid username or password.' });

  /*
  compare the typed password with the saved hash.
  we can't un-hash, so bcrypt hashes the typed one and checks if they match.
  */
  const match = await bcrypt.compare(password, user.password);

  /*
  same message for a wrong username and a wrong password.
  that way nobody can use it to find out which usernames exist.
  */
  if (!match) return res.status(401).json({ message: 'Invalid username or password.' });

  /*
  make the token.
  jwt.sign(what to store inside, secret, options)
  the client keeps it and sends it back later to prove who it is.
  expiresIn: '7d' means it stops working after 7 days.
  */
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ message: 'Login successful (2FA disabled).', user: { username: user.username, email: user.email }, token });
});


/*
POST /register
the client sends { username, email, password }.
*/
router.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) return res.status(400).json({ message: 'All fields required.' });

  const exists = await User.findOne({ $or: [{ username }, { email }] });

  if (exists) return res.status(409).json({ message: 'Username or email already exists.' });

  /*
  hash the password before saving.
  10 is the number of salt rounds: higher is safer but slower.
  */
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hash });

  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ message: 'Registration successful (2FA disabled).', user: { username: user.username, email: user.email }, token });
});


/*
POST /verify-2fa
a placeholder. 2FA is switched off, so this only says so.
it's kept so the route exists if 2FA comes back.
*/
router.post('/verify-2fa', (req, res) => {
  res.status(200).json({ message: '2FA is currently disabled.' });
});


module.exports = router;


/*
status code cheatsheet (the ones used above)

200  ok (default for res.json)
400  bad request, missing data
401  unauthorized, wrong login
409  conflict, already exists
*/