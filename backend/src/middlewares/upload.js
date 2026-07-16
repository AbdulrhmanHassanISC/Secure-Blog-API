const multer = require("multer");
const path = require("path");









const createStorage = (folder, prefix) => {
    return multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.join(__dirname, '../public/uploads', folder));
        },

        filename(req, file, cb) {
            cb(
                null,
                `${prefix}-${Date.now()}${path.extname(file.originalname)}`
            );
        }
    });
};

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"));
    }
};

const commonOptions = {
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
};


const uploadAvatar = multer({
    storage: createStorage("avatars", "avatar"),...commonOptions
});

const uploadPost = multer({
    storage: createStorage("posts", "post"),...commonOptions
});



module.exports = {uploadAvatar,uploadPost};
