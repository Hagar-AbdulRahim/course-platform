const express = require('express');
const router = express.Router({ mergeParams: true });
const { getLessons, getLessonById, createLesson, deleteLesson, updateLesson } = require('../controllers/lessonController');
const { protect, instructorOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getLessons);
router.get('/:lessonId', getLessonById);
router.post('/', protect, instructorOnly, upload.single('video'), createLesson);
router.patch('/:lessonId', protect, instructorOnly, upload.single('video'), updateLesson);
router.delete('/:lessonId', protect, instructorOnly, deleteLesson);

module.exports = router;