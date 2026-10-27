/*
✿ routes/blog.js ✿
the blog URLs

if you're having difficulty understanding this structure,
refer to ./auth.js or ./user.js. it explains how a route works.

read next: middleware/
*/

const express = require('express');
const {
  createBlog,
  getBlogs,
  getBlogById,
  deleteBlog
} = require('../controllers/blogControllers');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Only authenticated users can create or delete blogs
router.post('/', authenticateToken, createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.delete('/:id', authenticateToken, deleteBlog);

module.exports = router;