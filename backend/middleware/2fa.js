/*
✿ middleware/2fa.js ✿
the second login check, sent by email

job: email a 6 digit code, then check it when the user types it back
called by: nothing right now. auth.js has 2FA switched off.
calls: nodemailer (sends the email)
read next: middleware/auth.js

middleware sits in front of a route, like this:
router.post('/login', send2FA, handler)
send2FA runs first. if it calls next(), handler runs.
*/


// ✿ 1. imports

const nodemailer = require('nodemailer');   // sends emails from node
const crypto = require('crypto');           // built into node. not used in this file.


// ✿ 2. where codes are kept

/*
a plain object, used like a notepad: twoFACodes["me@mail.com"] = { code, expires }
it lives in memory, so every code is gone when the server restarts.
fine for learning. real apps use a database or Redis.
*/
// In-memory store for 2FA codes (for demo; use Redis or DB in production)
const twoFACodes = {};


// ✿ 3. the email sender

/*
a transporter is the thing that actually sends mail.
the login details come from .env, so they never sit in the code.
for Gmail, EMAIL_PASS is usually an app password, not your normal one.
*/
// Configure your transporter (update with your SMTP credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ✿ 4. send the code

/*
middleware shape: (req, res, next)
next() = "all good, go to the next step"
sending a response instead = "stop here"
*/
// Middleware to send 2FA code
async function send2FA(req, res, next) {
  const { email } = req.body;

  // 400 = bad request. we can't email nobody.
  if (!email) return res.status(400).json({ message: 'Email required for 2FA.' });

  /*
  make a 6 digit code.
  Math.random() gives a number from 0 up to 1.
  times 900000, plus 100000, lands between 100000 and 999999.
  floor drops the decimals. toString turns it into text so it can be compared later.
  */
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  /*
  save the code under the email.
  expires is a timestamp in milliseconds: now + 10 * 60 * 1000 = 10 minutes.
  */
  twoFACodes[email] = { code, expires: Date.now() + 10 * 60 * 1000 };

  // sending email can fail (bad password, no internet), so we wrap it in try/catch
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Blogspace 2FA Code',
      text: `Your verification code is: ${code}`,
    });
    next();   // email sent. move on to the next step.
  } catch (err) {
    res.status(500).json({ message: 'Failed to send 2FA email.' });   // 500 = the server's problem
  }
}


// ✿ 5. check the code

/*
the user types the code from their email.
no async here, because nothing slow happens. it only looks in memory.
*/
// Middleware to verify 2FA code
function verify2FA(req, res, next) {
  const { email, code } = req.body;
  const entry = twoFACodes[email];   // what we saved earlier, or undefined

  /*
  fail if any of these are true:
  - no code was ever sent to this email
  - the code doesn't match
  - the 10 minutes are up
  401 = unauthorized
  */
  if (!entry || entry.code !== code || Date.now() > entry.expires) {
    return res.status(401).json({ message: 'Invalid or expired 2FA code.' });
  }

  delete twoFACodes[email];   // a code works once. remove it so it can't be reused.
  next();
}


// ✿ 6. export

// two functions in an object. other files pick the ones they need.
module.exports = { send2FA, verify2FA };


/*
middleware cheatsheet

(req, res, next)   the shape of every middleware
next()             pass the request on
res.status().json  answer now, request stops here
async              only needed when you use await inside
*/