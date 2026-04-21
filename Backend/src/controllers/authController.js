const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, country, university, faculty, goal } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const profileImage = req.file ? `/uploads/${req.file.filename}` : '';

    const user = await User.create({ 
      name, email, password, role, phoneNumber, country, university, faculty, goal, profileImage 
    });

    res.status(201).json({
      message: 'User registered successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        country: user.country,
        university: user.university,
        faculty: user.faculty,
        goal: user.goal,
        profileImage: user.profileImage
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        country: user.country,
        university: user.university,
        faculty: user.faculty,
        goal: user.goal,
        profileImage: user.profileImage
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log('Update Profile Request Received');
    console.log('User ID:', req.user?._id);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.country = req.body.country || user.country;
    user.university = req.body.university || user.university;
    user.faculty = req.body.faculty || user.faculty;
    user.goal = req.body.goal || user.goal;
    
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    } else {
      user.profileImage = req.body.profileImage || user.profileImage;
    }
    if (req.body.password) {
       user.password = req.body.password;
    }

    const updatedUser = await user.save();
    console.log('Profile updated. New Image Path:', updatedUser.profileImage);
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
        country: updatedUser.country,
        university: updatedUser.university,
        faculty: updatedUser.faculty,
        goal: updatedUser.goal,
        profileImage: updatedUser.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, updateProfile };