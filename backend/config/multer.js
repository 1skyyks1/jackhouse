const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 文件上传的临时目录
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()/*+ '-' + Math.round(Math.random() * 1E9)*/;
        const fileExtension = path.extname(file.originalname);
        const fileName = file.originalname.replace(fileExtension, '');
        cb(null, fileName + '-' + uniqueSuffix + fileExtension);
    }
});

const imageUpload = multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            return cb(new Error('只允许上传图片文件'), false);
        }
    }
});

module.exports = {
    upload: multer({ storage: storage }),
    imageUpload: imageUpload
};