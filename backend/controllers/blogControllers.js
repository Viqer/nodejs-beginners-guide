/*
controllers/blogControllers.js
the kitchen for blogs

job: do the actual work for each blog URL
called by: routes/blog.js
calls: models/Blogs.js
read next: that's the end of the tour. try the exercises in the README.

controllers look odd at first, but they're the easiest files here.
every function is the same recipe, repeated:
1. read what came in (req)
2. ask the model to do something
3. send an answer back (res)
4. catch errors

learn one and you've learned them all.
commentControllers.js and userControllers.js follow the same pattern.
*/


// 1. imports

const Blog = require('../models/Blogs');   // the blueprint. Blog.find, Blog.save and friends come from here.


/*
how sharing works in this file

exports.name = ... adds one function to what this file shares.
it's the same idea as module.exports = { ... } in the other files, just done one at a time.
route files pick them with: const { createBlog } = require('../controllers/blogControllers')
*/


// 2. create

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;   // the data the client sent

    /*
    req.user was set by middleware/auth.js.
    that's how we know who is writing the blog.
    */
    // Use authenticated user from token
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });

    const blog = new Blog({ title, content, user: userId, image });   // builds a blog in memory. not saved yet.
    await blog.save();   // now it goes into MongoDB. mongoose checks it against the schema first.
    res.status(201).json(blog);   // 201 = created
  } catch (err) {
    res.status(400).json({ error: err.message });   // 400 = bad data, like a missing title
  }
};


// 3. read all

// Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    /*
    Blog.find() with nothing inside means "everything".
    populate('user'): a blog only stores its writer's id. populate swaps that id for the full user.
    sort({ createdAt: -1 }): newest first. -1 = high to low.
    */
    const blogs = await Blog.find().populate('user').sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });   // reads only fail if the server or database does
  }
};


// 4. read one

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    // req.params.id is the :id from the URL. /blogs/123 gives "123".
    const blog = await Blog.findById(req.params.id).populate('user');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });   // nothing matched
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 5. delete

// Delete a blog by ID
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;   // same as req.params.id, just pulled out first
    const blog = await Blog.findByIdAndDelete(id);   // removes it and gives back what it removed, or null
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/*
the recipe cheatsheet

read input     req.body (sent data), req.params (from the URL), req.user (from middleware)
talk to db     Blog.find, Blog.findById, blog.save, Blog.findByIdAndDelete
respond        res.status(code).json(data)
catch          400 for bad data, 500 for server trouble

the four jobs (CRUD)
create   POST     save something new
read     GET      fetch one or many
update   PUT      change something
delete   DELETE   remove something

new status codes: 201 created
*/