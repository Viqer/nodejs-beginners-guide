/*
models/Blogs.js
the shape of a blog

if you're having difficulty understanding this structure,
refer to ./Users.js. it explains the basics line by line.
(same pattern here, just different fields)
two new ideas show up below: ref and timestamps.

read next: routes/
*/


const mongoose = require('mongoose');
const { Schema } = mongoose;


const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  /*
  new idea: linking two models.
  a blog doesn't copy the writer's details. it stores the writer's id.
  ObjectId is the id type MongoDB gives every document.
  ref: 'User' says which model that id belongs to.
  it matches the name in mongoose.model('User', ...) in Users.js.
  this link is what lets populate('user') in blogControllers.js
  swap the id for the full user.
  */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    required: false,
  },

  rating: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },

  /*
  new idea: schema options.
  the second argument to new Schema() is a set of options.
  timestamps: true makes mongoose add createdAt and updatedAt for us
  and keep them up to date.
  that's why blogControllers.js can sort by createdAt
  even though it isn't listed above.
  (Users.js adds createdAt by hand. this does it automatically.)
  */
}, { timestamps: true });


/*
the model is stored in a collection called "blogs".
other files grab it with: const Blog = require('../models/Blogs')
*/
module.exports = mongoose.model('Blog', blogSchema);