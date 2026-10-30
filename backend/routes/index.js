/*
routes/index.js
the switchboard

job: gather every route file and give each one a URL prefix
called by: server.js
calls: blog.js, comment.js, user.js, auth.js
read next: middleware/

this is the one file server.js talks to.
it hands each request to the right route file,
and catches anything that doesn't match.
*/


const express = require('express');
const routes = express.Router();

const blogRoutes = require('./blog');
const commentRoutes = require('./comment');
const userRoutes = require('./user');
const authRoutes = require('./auth');


/*
routes.use('/prefix', router) puts a whole route file behind a prefix.
the route file only writes the rest of the path.

so router.post('/login') in auth.js becomes POST /auth/login.
and router.get('/me') in user.js becomes GET /users/me.
*/
routes.use('/blogs', blogRoutes);
routes.use('/comments', commentRoutes);
routes.use('/users', userRoutes);
routes.use('/auth', authRoutes);


/*
this sits below every route on purpose.
a request that matched nothing above falls all the way down to here.
no path given, so it catches everything that reaches it.
if it were placed first, it would answer every request with a 404.
*/
routes.use((req, res, next) => {
  res.status(404).json({ error: 'Request not found' });
});


/*
this one has four arguments: (err, req, res, next).
that's how express knows it's an error handler.
errors from any route above end up here.

express 5 (the version in package.json) also sends errors from async routes here.
that's why the async routes in auth.js work without try/catch.

505 is rare. it's kept for the one case it's meant for.
everything else becomes a plain 500.
*/
routes.use((err, req, res, next) => {
  if (err.status === 505) {
    res.status(505).json({ error: 'HTTP Version Not Supported' });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = routes;