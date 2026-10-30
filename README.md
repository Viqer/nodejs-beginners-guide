# Blogspace

a NodeJS backend template. it shows how a backend works and gives you something to build on.

this is a small blogging site: people sign up, log in, write blogs and comment. strip out the blog parts and what's left is the skeleton almost every backend has. a server, a database, login, and a clean place for each kind of code.

every file has comments that explain what it does. start from this, swap in your own idea, and you're not staring at a blank folder.

good if you're new to Node, or if you've been pasting LLM code and want to know where each piece belongs.

the frontend is in the repo too, but ignore it. this is only about `backend/`.

## What you get

- a server that starts and listens
- a MongoDB connection
- signup and login with hashed passwords and tokens
- routes, controllers and models, each in its own folder
- middleware that guards routes
- comments in every file

## Before you start

you only need to read basic JavaScript.

it works. all it needs is a MongoDB database and a `.env` file with your own settings and keys. those aren't in the repo, so set them up before you run it.

the `.env` goes in `backend/`:

    MONGODB_URI=       your MongoDB connection string
    APP_HOST=          where the server runs, like localhost
    APP_PORT=          the port, like 3000
    JWT_SECRET_KEY=    any long random text. signs the login tokens

then:

```bash
cd backend
npm install
npm start
```

`npm run dev` restarts the server every time you save.

node runs your JavaScript outside the browser. express is a library that makes building a server with node much easier. this project uses both, plus MongoDB for the data.

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
nodemon        restarts the server when you save
```

## How a request travels

```
request -> server.js -> routes -> middleware -> controller -> model -> database
                                                     |
response <-------------------------------------------+
```

think of it like a restaurant. routes are the host who sends you to a table. middleware is the bouncer checking your ID. the controller is the kitchen. the model is the recipe book. the database is the fridge.

For an example how the HTTP request `GET /users/me` actually work:

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

## Make it yours

say you want a new thing in your app, like "projects". the recipe is always the same:

1. `models/Projects.js`: copy `Blogs.js`, change the fields
2. `controllers/projectControllers.js`: copy `blogControllers.js`, swap in your model
3. `routes/project.js`: copy a route file and point it at your controller
4. `routes/index.js`: add `routes.use('/projects', projectRoutes)`
5. guard it: add `authenticateToken` to the routes that need a login

that's it. once you've done it once, you can done for every feature you'll ever add.
to remove the blog parts, delete the blog and comment files in each folder and the lines for them in `routes/index.js`.
even if you're using LLMs to generate your backend server, having a clean template results in the AI to not give you slop code but rather something that is humanly readable, and debuggable if needed.

## Reading order

1. `server.js`
2. `config/database.js`
3. `models/` (`Users.js` first, it explains the pattern)
4. `routes/` (`index.js`, then `auth.js`, then `user.js`, then the other two)
5. `middleware/` (`auth.js`, `encrypt.js`, then `2fa.js` as a bonus)
6. `controllers/` (`blogControllers.js` first)

data first, then the flow around it.

## Every file has comments

every file starts with a header that tells you what it does, what calls it, what it calls, and what to read next. the code underneath is commented in plain english.

some files are fully commented and some just point you to a similar one. the models and controllers repeat the same pattern, and have been only explained once (eg. controllers). read it and then try to see if you can understand it without the comments holding your hand in every file. 

## Cheatsheet: status codes

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

## Notes

2FA by email is in the code but switched off. it's there if you want to turn it on.
this is a starting point, not finished production code. check the security and settings before actually using it.

built by Viqer and Nekimo

Find my friend nekimo at [neki.moe](https://neki.moe)
