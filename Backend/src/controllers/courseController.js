const Course = require('../models/course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const filter = { ...keyword, ...category };
    
    const total = await Course.countDocuments(filter);
    const coursesRaw = await Course.find(filter)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const courses = await Promise.all(coursesRaw.map(async (c) => {
       const [lessonsCount, studentsCount] = await Promise.all([
          Lesson.countDocuments({ course: c._id }),
          Enrollment.countDocuments({ course: c._id })
       ]);
       return { ...c._doc, lessonsCount, studentsCount };
    }));

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'name email'
    );
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const [lessonsCount, studentsCount] = await Promise.all([
       Lesson.countDocuments({ course: course._id }),
       Enrollment.countDocuments({ course: course._id })
    ]);
    
    res.json({ ...course._doc, lessonsCount, studentsCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : '';
    const course = await Course.create({
      title,
      description,
      price,
      category,
      thumbnail,
      instructor: req.user._id,
    });
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const updateData = { ...req.body };
    if (req.file) {
      updateData.thumbnail = `/uploads/${req.file.filename}`;
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json({ message: 'Course updated successfully', course: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    
    await Lesson.deleteMany({ course: course._id });
    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
