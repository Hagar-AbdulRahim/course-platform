const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/course');
const Lesson = require('./models/Lesson');
const User = require('./models/User');

dotenv.config();

const courses = [
  {
    title: 'Advanced React 19 Architecture',
    description: 'Learn to build scalable frontends using the latest React 19 features, Server Components, and professional state management patterns.',
    price: 49.99,
    category: 'Technology',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Modern UI/UX Design Strategy',
    description: 'A deep dive into user experience strategy, high-fidelity prototyping in Figma, and creating premium design systems.',
    price: 39.99,
    category: 'Design',
    thumbnail: 'https://images.unsplash.com/photo-1541462608141-ad60397d4ec7?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Fullstack Node.js Backend Mastery',
    description: 'Master backend development with Node.js, Express, and MongoDB. Secure your apps with professional JWT authentication.',
    price: 44.99,
    category: 'Programming',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    await Course.deleteMany({});
    await Lesson.deleteMany({});

    // Update Instructor with a DIGNIFIED MALE image for "Ali"
    const instructor = await User.findOneAndUpdate(
      { name: /ali/i },
      { 
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
        bio: 'Senior Technical Architect with 15+ years of experience in leading engineering teams.'
      },
      { returnDocument: 'after' }
    );

    if (!instructor) {
      console.log('Note: Ali not found, updating first instructor found.');
      await User.findOneAndUpdate(
        { role: 'instructor' },
        { profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop' }
      );
    }

    // Set high-quality student images (mix)
    const students = await User.find({ role: 'student' });
    for (let i = 0; i < students.length; i++) {
        const img = i % 2 === 0 
           ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' // Male
           : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop'; // Female
        await User.findByIdAndUpdate(students[i]._id, { profileImage: img });
    }

    const finalInstructor = await User.findOne({ role: 'instructor' });

    for (const c of courses) {
      const course = await Course.create({ ...c, instructor: finalInstructor._id });
      
      await Lesson.create([
        {
          title: 'Project Foundations and Environment',
          content: 'Setting up a professional development workspace for enterprise-level applications.',
          duration: 25,
          order: 1,
          course: course._id,
          videoUrl: '/uploads/sample1.mp4'
        },
        {
          title: 'Architecting Components for Scale',
          content: 'How to design reusable, high-performance components.',
          duration: 40,
          order: 2,
          course: course._id,
          videoUrl: '/uploads/sample2.mp4'
        }
      ]);
    }

    console.log('Seeded successfully with correct gender images!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
