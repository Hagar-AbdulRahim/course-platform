const express = require('express');
const path = require('path');
const cors = require('cors');

const errorHandler = require('./middleware/errorMiddleware');
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lessons/:lessonId/comments', commentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Course Platform API is running' });
});

app.use(errorHandler);
module.exports = app;