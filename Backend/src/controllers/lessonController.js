const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

const getLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    if (!courseId || !mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });
    res.json({ 
      success: true,
      count: lessons.length, 
      lessons 
    });
  } catch (error) {
    console.error('getLessons error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching lessons',
      error: error.message 
    });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).populate('course');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check if user is the instructor of this course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }

    const { title, content, order, duration } = req.body;
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const lesson = await Lesson.create({
      title,
      content,
      order: order || 0,
      duration: duration || 0,
      videoUrl,
      course: courseId,
    });

    res.status(201).json({ 
      success: true,
      message: 'Lesson created successfully', 
      lesson 
    });
  } catch (error) {
    console.error('createLesson error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating lesson',
      error: error.message 
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // Find course to check ownership
    const course = await Course.findById(lesson.course);
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not authorized to delete this lesson' });
    }

    await lesson.deleteOne();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('deleteLesson error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    let lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const course = await Course.findById(lesson.course);
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this lesson' });
    }

    const { title, content, order, duration } = req.body;
    if (title) lesson.title = title;
    if (content) lesson.content = content;
    if (order) lesson.order = order;
    if (duration) lesson.duration = duration;
    if (req.file) lesson.videoUrl = `/uploads/${req.file.filename}`;

    await lesson.save();
    res.json({ success: true, message: 'Lesson updated successfully', lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLessons, getLessonById, createLesson, deleteLesson, updateLesson };
