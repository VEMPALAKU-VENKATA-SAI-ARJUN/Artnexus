// middleware/upload.js
const multer = require('multer');

// store in memory for MongoDB storage as buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
