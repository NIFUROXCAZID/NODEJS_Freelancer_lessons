import multer from 'multer'
import path from 'path'
import { uploadsPath } from '../core/path.mjs'

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsPath)
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)

    cb(null, uniqueSuffix + ext)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Дозволені лише JPG, PNG та WEBP зображення'), false)
  }

  cb(null, true)
}

const uploadMiddleWare = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
})

export default uploadMiddleWare