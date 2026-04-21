const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    content: { type: String, required: [true, 'Content is required'] },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    videoUrl: { type: String, default: '' },
  },
  { timestamps: true }
);
module.exports = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);