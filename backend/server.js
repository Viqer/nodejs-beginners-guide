/*
server.js
the front door of the whole backend

job: start the app and listen for requests
run it: npm start (or npm run dev to auto restart)
calls: config/database.js, routes/index.js
read next: config/database.js
*/


/*
require() loads code from another package or file.
curly braces pull one named thing out of what a file exports.
*/
const express = require('express');
const cors = require('cors');

const { dbConnection } = require("./config/database")
const allRoutes = require("./routes/index")

/*
app is the server.
everything below hangs off it.
*/
const app = express();


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
  origin: 'http://localhost:3001',
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


/*
env vars hold things that change between machines (port, host, secrets).
= 3000 is a fallback if APP_PORT is missing.
*/
const { APP_HOST, APP_PORT = 3000 } = process.env;


app.use(allRoutes);

/*
app.listen(port, callback).
the callback runs once the server is up.
*/
app.listen(APP_PORT, () => {
  dbConnection()
  const serverUrl = `http://${APP_HOST}:${APP_PORT}`
  const apiUrl = `${serverUrl}`
  console.log(`\n\nServer URL ${serverUrl}`);
  console.log(`API URL ${apiUrl} \n\n`);
});