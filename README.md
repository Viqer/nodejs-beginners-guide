# Blogspace

a beginner's guide to NodeJS, disguised as a blog backend.

the idea is simple. every folder does one job, every file has comments that say what that job is, and you read it in order. no magic, no 40 layers of abstraction. if you can follow a request from the browser to the database and back, you understand how most Node apps work.

works if you're new to Node. also works if you've been pasting LLM code and want to finally know what it's doing. you'll spot bad code way faster once you know where each piece belongs.

the frontend is in the repo too, but ignore it. this guide is only about `backend/`.

## What you'll learn

- how a Node server starts and listens
- how a request travels through an app
- why code gets split into routes, controllers, models and middleware
- how to connect to a database
- how login, tokens and password hashing work
- how to read code you didn't write

## Before you start

you only need to read basic JavaScript. that's it.

this was a live site once, so the secrets and settings aren't in the repo. it needs a MongoDB connection and a `.env` file to run, and this guide doesn't cover them. think of it as a read-through, not a run-through.

## The map

```
backend/
  server.js          starts the app. read this first
  config/
    database.js      connects to MongoDB
  models/            the shape of your data
    Users.js         the reference file. start here
    Blogs.js
    Comments.js
  routes/            match a URL to some code
    index.js         puts every route file behind a prefix
    auth.js          login and signup
    user.js          users, with guards at the door
    blog.js          blog URLs
    comment.js       comment URLs
  middleware/        code that runs before a route
    auth.js          checks the login token
    encrypt.js       hashes passwords
    2fa.js           emailed login code (switched off)
  controllers/       the actual work for each URL
    blogControllers.js   the reference file
    commentControllers.js
    userControllers.js
```

## The tools

```
express        the framework. server, routes, middleware
mongoose       talks to MongoDB, defines models
cors           lets the frontend call the backend
dotenv         loads settings from a .env file
bcryptjs       hashes passwords
jsonwebtoken   makes and checks login tokens
nodemailer     sends emails (used by 2fa)
nodemon        restarts the server when you save (npm run dev)
```

## How a request travels

```
request -> server.js -> routes -> middleware -> controller -> model -> database
                                                     |
response <-------------------------------------------+
```

think of it like a restaurant. routes are the host who sends you to a table. middleware is the bouncer checking your ID. the controller is the kitchen. the model is the recipe book. the database is the fridge.

here's one real trip, `GET /users/me`:

```
server.js            gets the request, passes it on
routes/index.js      sees /users, sends it to user.js
routes/user.js       runs the guards first
middleware/auth.js   reads the token, sets req.user
routes/user.js       checks the frontend header, then runs the /me code
models/Users.js      findById looks the user up
response             the user goes back as JSON
```

## URL map

```
/auth/...      login and register
/users/...     users
/blogs/...     blogs
/comments/...  comments
anything else  404
```

## Reading order

1. `server.js`
2. `config/database.js`
3. `models/` (`Users.js` first, it explains the pattern)
4. `routes/` (`index.js`, then `auth.js`, then `user.js`, then the other two)
5. `middleware/` (`auth.js`, `encrypt.js`, then `2fa.js` as a bonus)
6. `controllers/` (`blogControllers.js` first)

data first, then the flow around it. it's easier that way, trust me.

## Every file has comments

every file starts with a ✿ header that tells you what it does, what calls it, what it calls, and what to read next. the code underneath is commented in plain english. if a comment feels too obvious, good. that's the point.

some files are fully commented and some just point you to a similar one. the models and controllers repeat the same pattern, so you only learn it once.

## Cheatsheet: status codes

the ones you'll meet in the code.

```
200  ok
201  created
400  bad request, missing or bad data
401  unauthorized, no login or wrong login
403  forbidden
404  not found
409  conflict, already exists
500  the server's problem
505  http version not supported
```

## Try it yourself

stuff to break on purpose:

- add a route in `routes/blog.js` that returns "hello"
- add a new field to `Blogs.js`, then update `createBlog` so it saves it
- write a middleware that logs every request, and add it in `server.js`
- in `routes/user.js`, move `router.use(authenticateToken)` above the sign up route and see what changes
- stretch: turn 2FA back on in the login route

## Notes

this is a learning project, not production code. don't ship it as is. read it, break it, then build your own.

built by Viqer and Nekimo

Find my friend nekimo at neki.moe