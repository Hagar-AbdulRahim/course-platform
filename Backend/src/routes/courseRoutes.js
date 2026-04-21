const express = require('express');
const router = express.Router();
const {
  getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse
} = require('../controllers/courseController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const lessonRoutes = require('./lessonRoutes');

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', protect, instructorOnly, upload.single('thumbnail'), createCourse);
router.patch('/:id', protect, instructorOnly, upload.single('thumbnail'), updateCourse);
router.delete('/:id', protect, instructorOnly, deleteCourse);

// Nested routes
router.use('/:courseId/lessons', lessonRoutes);

module.exports = router;