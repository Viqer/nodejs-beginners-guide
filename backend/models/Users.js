/*
models/Users.js
the shape of a user

job: describe what a user looks like in the database
called by: controllers/ (when they read or save users)
calls: mongoose
read next: routes/
*/


const mongoose = require('mongoose');

const { use } = require('react');

const { Schema } = mongoose;

/*
a schema is a blueprint.
each key below is a field every user will have.
mongoose checks new data against it before saving.
*/
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    /*
    passwords should be hashed before they get saved here, never stored raw.
    bcryptjs in package.json is the tool for that.
    */
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    /*
    Date.now has no () on purpose.
    we pass the function itself, so it runs each time a user is created.
    with () it would run once at startup and every user would get the same time.
    */
    default: Date.now,
  }
});


/*
mongoose.model(name, schema) turns the blueprint into something we can use
to create, find, update and delete users.
mongoose stores them in a collection called "users" (lowercase and plural).
other files grab it with: const User = require('../models/Users')
*/
module.exports = mongoose.model('User', userSchema);