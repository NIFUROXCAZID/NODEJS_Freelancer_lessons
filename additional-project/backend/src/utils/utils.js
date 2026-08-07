import fs from 'fs'
import path from 'path'
import { uploadsPath } from '../core/path.mjs'

// Видаляє файл з диска При оновленні товару, При видаленні товару
export function deleteFileFromDir(filename) {
  if (!filename) return

  const cleanFilename = filename.replace('/uploads/', '')

  const filePath = path.join(uploadsPath, cleanFilename)

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}