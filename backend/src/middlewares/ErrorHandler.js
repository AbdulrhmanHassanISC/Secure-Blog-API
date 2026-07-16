const ErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: "File too large. Max 5MB." });
    }

    if (err.message === 'Invalid file type') {
        return res.status(400).json({ success: false, message: "Invalid file type. Only JPEG, PNG, GIF allowed." });
    }

    if (err.message === 'Unexpected field') {
        return res.status(400).json({ success: false, message: "Unexpected field name in upload." });
    }

    return res.status(statusCode).json({ success: false, message });
}
module.exports = ErrorHandler