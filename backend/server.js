/*
server.js
the front door of the whole backend

job: start the app and listen for requests
run it: npm start (or npm run dev to auto restart)
calls: config/database.js, routes/index.js
read next: config/database.js
*/


// 1. imports

/*
require() loads code from another package or file.
curly braces pull one named thing out of what a file exports.
*/
const express = require('express');   // the framework. gives us the app, routes and middleware
const cors = require('cors');         // lets a frontend on another port talk to this server

const { dbConnection } = require("./config/database")  // function that connects to MongoDB
const allRoutes = require("./routes/index")            // every URL the app knows about


// 2. create the app

/*
app is the server.
everything below hangs off it.
*/
const app = express();


// 3. middleware

/*
app.use() adds middleware: code that runs on every request.
order matters. requests pass through top to bottom.
*/

/*
cors blocks browsers from calling us unless we say it's ok.
origin = who is allowed in.
credentials = allow cookies and auth headers.
*/
app.use(cors({
  origin: 'http://localhost:3001', // Change this if your frontend runs on a different port
  credentials: true
}));

/*
serves files from a folder called "public" as they are (images, html, etc).
there is no public folder in backend/ right now, so this does nothing yet.
*/
app.use(express.static('public'));

/*
reads JSON sent in a request and puts it on req.body.
skip this and req.body is undefined.
*/
app.use(express.json());

/*
loads your .env file into process.env.
any code that reads process.env should run after this line.
*/
require('dotenv').config();


// 4. settings from .env

/*
env vars hold things that change between machines (port, host, secrets).
= 3000 is a fallback if APP_PORT is missing.
*/
const { APP_HOST, APP_PORT = 3000 } = process.env;


// 5. routes

// hands every request to routes/index.js, which decides where it goes next
app.use(allRoutes);


// 6. start listening

/*
app.listen(port, callback).
the callback runs once the server is up.
*/
app.listen(APP_PORT, () => {
  dbConnection()   // connect to the database only after the server is up
  const serverUrl = `http://${APP_HOST}:${APP_PORT}`
  const apiUrl = `${serverUrl}`   // same as serverUrl here
  console.log(`\n\nServer URL ${serverUrl}`);
  console.log(`API URL ${apiUrl} \n\n`);
});