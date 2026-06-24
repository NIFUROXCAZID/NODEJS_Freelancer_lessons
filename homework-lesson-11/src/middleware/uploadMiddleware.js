import multer from 'multer'
import { uploadsPath } from '../core/path.mjs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath)
  },

  filename: function (req, file, cb) {

    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9)

    cb(
      null,
      uniqueSuffix + '-' + file.originalname
    )
  },
})

const fileFilter = (req, file, cb) => {

  // дозволені mime types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ]

  if (!allowedTypes.includes(file.mimetype)) {

    return cb(
      new Error(
        'Дозволені лише JPG, PNG та WEBP зображення'
      ),
      false
    )
  }

  cb(null, true)
}

const uploadMiddleWare = multer({

  storage,

  // ліміт розміру
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter,
})

export default uploadMiddleWare