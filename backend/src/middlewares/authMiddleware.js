const jwt = require('jsonwebtoken');
const postmodel = require('../models/postsModel');
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const tokenOnly = token.split(" ")[1];
  console.log(tokenOnly);

  try {
    const decodedToken = jwt.verify(tokenOnly, process.env.JWT_SECRET);
    req.user = decodedToken;

    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: error.message });
  }



}


const ownershipVerification = async (req, res, next) => {
  const { userId ,role} = req.user;
  const { id } = req.params;


  if (role === "admin") {
    return next();
  }

  try {
    const post = await postmodel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const author = post.author.toString();
    if (author !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



module.exports = { verifyToken, ownershipVerification };  
