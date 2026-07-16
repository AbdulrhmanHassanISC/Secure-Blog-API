const express = require('express');
const router = express.Router();
const { profile,updateAvatar } = require('../controllers/profile');
const { verifyToken } = require('../middlewares/authMiddleware');
const {uploadAvatar} = require('../middlewares/upload');

router.get("/", verifyToken, profile);
router.put("/avatar", verifyToken, uploadAvatar.single('avatar'), updateAvatar);
module.exports = router;