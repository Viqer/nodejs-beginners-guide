/*
✿ controllers/commentControllers.js ✿
the kitchen for comments

if you're having difficulty understanding this structure,
refer to ./blogControllers.js. same recipe, different model.

read next: that's the end of the tour. try the exercises in the README.
*/

const Comment = require('../models/Comments');
const Blog = require('../models/Blogs');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;
    // Use authenticated user from token
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ error: 'User not authenticated' });
    const comment = new Comment({ blog: blogId, user: userId, content });
    await comment.save();
    await comment.populate('user'); // Populate user for frontend display
    // Increment commentCount on the blog
    const updateResult = await Blog.findByIdAndUpdate(blogId, { $inc: { commentCount: 1 } });
    if (!updateResult) {
      console.error(`Blog not found for incrementing commentCount. blogId: ${blogId}`);
      return res.status(404).json({ error: 'Blog not found for comment count update' });
    }
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error in createComment:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get all comments for a blog
exports.getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blog: blogId }).populate('user').sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    // Decrement commentCount on the blog
    const updateResult = await Blog.findByIdAndUpdate(comment.blog, { $inc: { commentCount: -1 } });
    if (!updateResult) {
      console.error(`Blog not found for decrementing commentCount. blogId: ${comment.blog}`);
      return res.status(404).json({ error: 'Blog not found for comment count update' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error in deleteComment:', err);
    res.status(500).json({ error: err.message });
  }
};