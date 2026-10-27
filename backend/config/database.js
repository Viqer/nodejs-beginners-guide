/*
✿ config/database.js ✿
connects the app to MongoDB

job: open one connection to the database
called by: server.js (once, when the server starts)
calls: mongoose, which talks to MongoDB for us
read next: models/
*/


// ✿ 1. imports

/*
mongoose is the middle person between our code and MongoDB.
it also lets us describe data with schemas (you'll see that in models/).
*/
const mongoose = require('mongoose');


// ✿ 2. the connect function

/*
async means this function can wait on slow things, like a network call.
connecting to a database takes a moment, so we wait for it with await.
*/
const dbConnection = async () => {

  /*
  try/catch: if anything inside try fails, jump to catch
  instead of crashing the whole app.
  */
  try {

    /*
    MONGODB_URI is the address of your database, read from .env.
    it looks like: mongodb://localhost:27017/blogspace
    it's read inside the function, so it only runs after dotenv has loaded.
    */
    await mongoose.connect(process.env.MONGODB_URI, {
      /*
      these two options come from older mongoose versions.
      newer versions do this by default, so they're harmless to keep.
      */
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

  } catch (err) {
    /*
    if the connection fails you'll see the reason here.
    the server keeps running, but anything that needs the database won't work.
    */
    console.error('MongoDB connection error:', err);
  }
};


// ✿ 3. export

/*
module.exports shares this function with other files.
server.js grabs it with: const { dbConnection } = require("./config/database")
*/
module.exports = { dbConnection };