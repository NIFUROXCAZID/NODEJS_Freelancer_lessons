import multer from 'multer'

export default function multerError(err, req, res, next) {

  if (!(err instanceof multer.MulterError)) {
    return next(err)
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).send('Файл занадто великий')
  }

  return res.status(400).send(err.message)
}