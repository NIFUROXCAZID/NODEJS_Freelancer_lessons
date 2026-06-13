import fs from 'fs'
import path from 'path'

class FilesManager {
  static removeImg(imgName, rootFolder, imgFolder = 'uploads') {
    const imgPath = path.join(rootFolder, imgFolder, imgName)
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath)
    }
  }
}

export default FilesManager
