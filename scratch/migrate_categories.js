const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Fix paths according to your structure
dotenv.config({ path: path.join(__dirname, '../Backend/.env') });

const Course = require('../Backend/src/models/Course');

const mapCategories = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/eduflex';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const mapping = {
      'Technology and IT': 'Web Development',
      'Art and Creativity': 'Graphic Design',
      'Language and Communication': 'Marketing',
      'Personal Development': 'Business'
    };

    const courses = await Course.find({});
    let updatedCount = 0;

    for (const course of courses) {
      if (mapping[course.category]) {
        course.category = mapping[course.category];
        await course.save();
        updatedCount++;
      } else if (!['Web Development', 'Graphic Design', 'Marketing', 'Business'].includes(course.category)) {
          // Default others to Business or something general if not in the 4
          course.category = 'Business';
          await course.save();
          updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} courses to the new 4 categories.`);
    process.exit();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

mapCategories();
