/*
routes/user.js
everything about users, after they've signed up

assuming you went through auth.js, this should be a breeze for you.
same route pattern, just three new ideas:
1. middleware that runs before a route (guards at the door)
2. order matters: a route only sees what was set up above it
3. :id in a URL, a blank that gets filled in per request

job: create, read, update and delete users
called by: routes/index.js
calls: controllers/userControllers.js, middleware/auth.js, middleware/encrypt.js
read next: middleware/
*/


const express = require('express');

/*
the logic for each route lives in controllers/.
this file only says which URL goes to which function.
*/
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userControllers');
const router = express.Router();


/*
middleware = a function that runs before the route's own code.
authenticateToken checks the login token and sets req.user.
encryptUserPassword hashes the password in req.body before it goes any further.
*/
const { authenticateToken } = require('../middleware/auth');
const { encryptUserPassword } = require('../middleware/encrypt');


/*
frontendOnly is middleware written right here.
it takes a third argument, next. calling next() means "ok, move on".
not calling it and sending a response instead stops the request there.
*/
function frontendOnly(req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  /*
  req.get() reads a header. the frontend adds X-Requested-By: frontend to its calls.
  no header, no entry. 403 = forbidden.
  it's a simple check, not strong protection, since any client can set a header.
  */
  if (req.get('X-Requested-By') !== 'frontend') {
    return res.status(403).json({ error: 'Access denied: Only frontend allowed.' });
  }
  next();
}


/*
express reads this file top to bottom.
a route only gets the middleware that sits above it.

the POST below sits above router.use(...), so anyone can call it.
everything after router.use(authenticateToken) needs a valid token.
authenticateToken goes before frontendOnly because frontendOnly reads req.user.
*/
router.post('/', encryptUserPassword, createUser);
router.use(authenticateToken);
router.use(frontendOnly);

router.get('/', getUsers);

/*
/me is "whoever is logged in".
authenticateToken already worked out who that is and put it on req.user.
*/
router.get('/me', async (req, res) => {
  try {
    const user = await require('../models/Users').findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
PUT = update.
encryptUserPassword runs first, so a new password gets hashed before saving.
req.body holds the fields to change.
{ new: true } makes the call return the updated user instead of the old one.
*/
router.put('/me', encryptUserPassword, async (req, res) => {
  try {
    const updatedUser = await require('../models/Users').findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/*
:id is a blank. /users/123 gives req.params.id = "123".
the controllers read it from there.

/me sits above these on purpose.
express picks the first match, so /users/me would be read as an id if :id came first.
*/
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


module.exports = router;


/*
who can call what

POST   /          anyone
GET    /          token + frontend header
GET    /me        token + frontend header
PUT    /me        token + frontend header
GET    /:id       token + frontend header
PUT    /:id       token + frontend header
DELETE /:id       token + frontend header

(paths are relative to where routes/index.js mounts this file)

new status codes: 403 forbidden, 404 not found, 500 server error
*/