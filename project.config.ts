import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const CACHE_PATH = path.resolve(process.cwd(), './images.json')

export const IMAGES_PATH = path.resolve(process.cwd(), './assets')

export const SUPPORT_IMAGE = ['svg', 'png', 'jpg', 'jpeg']