/*
routes/comment.js
the comment URLs

if you're having difficulty understanding this structure,
refer to ./auth.js or ./user.js. it explains how a route works.

read next: middleware/
*/

const express = require('express');
const {
  createComment,
  getComments,
  deleteComment
} = require('../controllers/commentControllers');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticateToken, createComment);

router.get('/:blogId', getComments);

router.delete('/:id', authenticateToken, deleteComment);

module.exports = router;