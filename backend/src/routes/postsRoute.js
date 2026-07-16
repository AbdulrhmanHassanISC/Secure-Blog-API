const express = require('express');
const router = express.Router();
const {getAllPosts,getPostById,createPost,updatePost,deletePost} = require('../controllers/postsController');
const {verifyToken,ownershipVerification} = require('../middlewares/authMiddleware');
const {uploadPost} = require('../middlewares/upload');

router.get('/',getAllPosts);
router.get('/:id',getPostById);
router.post('/',verifyToken,uploadPost.array('post', 10),createPost);
router.put('/:id',verifyToken,ownershipVerification,updatePost);
router.delete('/:id',verifyToken,ownershipVerification,deletePost);

module.exports = router;   