const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.post('/register', upload.single('profileImage'), register);
router.post('/login', login);
router.patch('/profile', protect, upload.single('profileImage'), updateProfile);

module.exports = router;