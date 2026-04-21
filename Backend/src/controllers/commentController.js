const Comment = require('../models/Comment');
const Lesson = require('../models/Lesson');

// POST /api/lessons/:lessonId/comments
const addComment = async (req, res) => {
  try {
    const { lessonId } = req.params;
    console.log('Adding comment to lesson:', lessonId);
    
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const comment = await Comment.create({
      content: req.body.content,
      student: req.user._id,
      lesson: lessonId,
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment,
    });
  } catch (error) {
    console.error('addComment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/lessons/:lessonId/comments
const getComments = async (req, res) => {
  try {
    const { lessonId } = req.params;
    console.log('Fetching comments for lesson:', lessonId);

    const comments = await Comment.find({ lesson: lessonId })
      .populate('student', 'name email profileImage country university faculty')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error('getComments error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getComments, deleteComment };