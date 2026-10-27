/*
✿ models/Comments.js ✿
the shape of a comment

if you're having difficulty understanding this structure,
refer to ./Users.js. it explains the basics line by line.
(same pattern here, just different fields)
ref and timestamps are explained in ./Blogs.js.

read next: routes/
*/

const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  // who wrote the comment. stores the user's id, linked to Users.js.
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  /*
  which blog the comment belongs to. stores the blog's id, linked to Blogs.js.
  this is how a blog finds its comments:
  look for comments whose blog matches the blog's id.
  */
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  rating: {
    type: Number,
    default: 0,   // a new comment starts at 0
  },
}, { timestamps: true });   // adds createdAt and updatedAt for us (see Blogs.js)

module.exports = mongoose.model('Comment', commentSchema);