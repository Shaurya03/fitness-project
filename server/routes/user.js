const express = require('express');

const { signupUser, loginUser, googleLogin } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post("/google", googleLogin);

module.exports = router;