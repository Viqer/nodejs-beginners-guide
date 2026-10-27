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
- how login, tokens and 2FA fit in

## Requirements

[Node.js](https://nodejs.org) (LTS)<br>
[Git](https://git-scm.com)<br>
[fill in: database, e.g. MongoDB]

## Run it

```bash
git clone https://github.com/Viqer/Blogspace.git
cd Blogspace/backend
npm install
node server.js
```

[fill in: .env variables, if any. check `config/database.js` for what it needs]

if it crashes on start, it's almost always the database connection. start with `config/database.js`.

## The map

```
backend/
  server.js          starts the app. read this first
  config/
    database.js      connects to the database
  routes/            match a URL to a controller
    index.js         puts all the routes in one place
    auth.js          login and signup URLs
    blog.js          blog URLs
    comment.js       comment URLs
    user.js          user URLs
  middleware/        runs before the controller does
    auth.js          checks who is making the request
    2fa.js           the second login check
    encrypt.js       protects sensitive stuff
  controllers/       the actual logic
    blogControllers.js
    commentControllers.js
    userControllers.js
  models/            the shape of your data
    Blogs.js
    Comments.js
    Users.js
```

## How a request travels

```
request -> server.js -> routes -> middleware -> controller -> model -> database
                                                     |
response <-------------------------------------------+
```

think of it like a restaurant. routes are the host who sends you to a table. middleware is the bouncer checking your ID. the controller is the kitchen. the model is the recipe book. the database is the fridge.

## Reading order

1. `server.js`
2. `config/database.js`
3. `models/`
4. `routes/`
5. `middleware/`
6. `controllers/`

data first, then the flow around it. it's easier that way, trust me.

## Every file has comments

open any file and the top tells you three things: what it does, what calls it, and what it calls. the code underneath is commented in plain english. if a comment feels too obvious, good. that's the point.

## Try it yourself

stuff to break on purpose:

- add a route that returns "hello"
- add a new field to the Blogs model
- write a middleware that logs every request
- turn off auth on one route and see what happens

## Notes

this is a learning project, not production code. don't ship it as is. read it, break it, then build your own.

built by Viqer.