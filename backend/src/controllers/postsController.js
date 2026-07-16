const postmodel = require('../models/postsModel');

const populateQuery = [
    { path: 'author', select: 'username email avatar role' },
    { path: 'category', select: 'name slug' },
];

const getAllPosts = async (req, res) => {
    try {
        const posts = await postmodel.find().populate(populateQuery);
        res.status(200).json({ success: true, message: "Posts retrieved successfully", data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getPostById = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await postmodel.findById(postId).populate(populateQuery);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        res.status(200).json({ success: true, message: "Post retrieved successfully", data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const createPost = async (req, res) => {
    const { title, content, author, category } = req.body;

    try {
        const newPost = new postmodel({ title, content, author });
        if (category) {
            newPost.category = category;
        }
        if (req.files && req.files.length > 0) {
            newPost.images = req.files.map(f => f.path);
        }
        await newPost.save();
        await newPost.populate(populateQuery);
        res.status(201).json({ success: true, message: "Post created successfully", data: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const updatePost = async (req, res) => {
    const postId = req.params.id;
    const { title, content, category } = req.body;
    try {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (category !== undefined) updateData.category = category || null;
        const updatedPost = await postmodel.findByIdAndUpdate(postId, updateData, { new: true }).populate(populateQuery);
        if (!updatedPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        res.status(200).json({ success: true, message: "Post updated successfully", data: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const deletedPost = await postmodel.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        res.status(200).json({ success: true, message: "Post deleted successfully", data: deletedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost }