const express = require('express');
const { register, login, getCurrentUser, updatePassword } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', require('../middleware/auth'), getCurrentUser);
router.put('/password', require('../middleware/auth'), updatePassword);

module.exports = router;