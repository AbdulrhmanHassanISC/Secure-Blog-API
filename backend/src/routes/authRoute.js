const express = require('express');
const router = express.Router();
const {registerUser,loginUser,profile} = require('../controllers/authController');
const {verifyToken} = require('../middlewares/authMiddleware');
router.post('/register',registerUser);
router.post('/login',loginUser);
router.get("/profile", verifyToken, profile);

module.exports = router; 