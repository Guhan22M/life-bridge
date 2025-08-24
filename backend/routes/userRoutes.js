const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
// const {googleLogin} = require('../controllers/googleAuthController');

router.post('/', registerUser); // POST /api/users
router.post('/login', loginUser); // POST /api/users/login
router.get('/me', protect, getMe); // GET /api/users/me
// router.post('/google', googleLogin);

module.exports = router;
