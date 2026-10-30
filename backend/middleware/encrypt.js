/*
middleware/encrypt.js
the password scrambler

job: hash the password in req.body before it gets saved
called by: routes/user.js (on POST / and PUT /me)
calls: bcryptjs
read next: controllers/

the file says "encrypt", but it hashes.
encrypting can be undone with a key. hashing can't be undone at all.
that's what we want for passwords: nobody, including us, can read them back.
at login, bcrypt.compare in routes/auth.js hashes the typed password and checks if the two match.
*/


// 1. imports

const bcryptjs = require('bcryptjs');   // the same hashing tool auth.js uses


// 2. admin version

/*
async because hashing takes a moment.
sits in front of a route, so by the time the route runs, req.body.password is already a hash.
this one isn't used in routes/user.js.
*/
const encryptAdminPassword = async (req, res, next) => {
  try {

    // only hash if a password was sent. a request that changes other fields won't have one.
    if (req.body.password) {

      /*
      a salt is random text mixed into the password before hashing.
      two users with the same password still end up with different hashes.
      10 = how much work to do. higher is safer but slower.
      */
      const salt = await bcryptjs.genSalt(10);

      // swap the typed password in req.body for its hash
      req.body.password = await bcryptjs.hash(req.body.password, salt);
    }
    next();   // done. on to the next step.

  } catch (err) {
    res.status(500).json({ error: 'Error encrypting password' });   // 500 = the server's problem
  }
};


// 3. user version

/*
the exact same steps as above, copy for copy.
the only difference is the name, so routes can say which kind of user they mean.
this is the one routes/user.js uses.
*/
const encryptUserPassword = async (req, res, next) => {
  try {
    if (req.body.password) {
      const salt = await bcryptjs.genSalt(10);
      req.body.password = await bcryptjs.hash(req.body.password, salt);
    }
    next();
  } catch (err) {
    res.status(500).json({ error: 'Error encrypting password' });
  }
};


// 4. export

module.exports = { encryptAdminPassword, encryptUserPassword };


/*
hashing cheatsheet

hash      one way. can't be undone. use for passwords.
encrypt   two way. needs a key. use for data you must read back.
salt      random text mixed in so equal passwords get different hashes.
compare   bcrypt.compare(typed, savedHash) says if they match.

two ways to hash with bcryptjs, both fine:
bcrypt.hash(password, 10)                     what routes/auth.js does
genSalt(10) then bcrypt.hash(password, salt)  what this file does
*/