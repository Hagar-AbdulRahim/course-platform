const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
  getCourseStudents,
} = require('../controllers/enrollmentController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');

router.post('/:courseId', protect, enrollInCourse);
router.get('/mycourses', protect, getMyCourses);
router.get('/:courseId/students', protect, instructorOnly, getCourseStudents);

module.exports = router;