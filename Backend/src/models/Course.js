const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);