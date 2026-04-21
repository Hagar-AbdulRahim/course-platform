const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// POST /api/enrollments/:courseId - student يسجل في كورس
const enrollInCourse = async (req, res) => {
  try {
    // 1. التأكد إن المستخدم مش مدرس (Instructor cannot enroll)
    if (req.user && req.user.role === 'instructor') {
      return res.status(403).json({ 
        message: 'Instructors cannot enroll in courses. You can only manage and create content.' 
      });
    }

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // التأكد إن الـ student مش مسجل قبل كده
    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: req.params.courseId,
    });

    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/enrollments/mycourses - كورسات الـ student
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course', 'title description price category thumbnail');

    res.json({
      count: enrollments.length,
      courses: enrollments.map((e) => e.course),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/enrollments/:courseId/students - طلاب الكورس (instructor فقط)
const getCourseStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email phoneNumber country university faculty goal');

    res.json({
      count: enrollments.length,
      students: enrollments.map((e) => e.student),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { enrollInCourse, getMyCourses, getCourseStudents };