import fs from 'fs'
import path from 'path'
import { uploadsPath } from '../core/path.mjs'

export function deleteFileFromDir(filename) {
  const filePath = path.join(uploadsPath, filename)

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}