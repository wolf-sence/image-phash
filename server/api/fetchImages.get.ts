import fs from 'fs'
import path from 'path'
// const path = require('path')
import { getQuery } from 'h3'
import { fileURLToPath } from 'url'
import { ImageBase64, ImageInfo } from '~/types/image'
import { CACHE_PATH, IMAGES_PATH, SUPPORT_IMAGE } from '~/project.config'
import { getFileSync, isFileExit } from '~/utils'


function findAllImagePath(filepath: string): string[] {
  const result: string[] = []
  const list = fs.readdirSync(filepath);
  list.forEach((file: string) => {
    const childrenPath: string = path.join(filepath, file);
    const stat = fs.statSync(childrenPath);
    const ext = path.extname(childrenPath).slice(1)

    if (stat && stat.isDirectory()) {
      const childrenList = findAllImagePath(childrenPath)
      result.push(...childrenList)
    } else if (SUPPORT_IMAGE.includes(ext)) {
      result.push(childrenPath);
    }
  });
  return result
}

let allImagesPath: string[] = []

function getImages(filePath: string, page: number, pageSize: number = 10): ImageBase64[] {
  let results: ImageInfo[] = [];
  if (allImagesPath.length <= 0) {
    allImagesPath = findAllImagePath(filePath)
  }

  // 当前所需的第几页
  const pagePaths = allImagesPath.slice((page - 1) * pageSize, page * pageSize)

  const imageList = pagePaths.map((p) => {
    const { buffer = '', size } = getFileSync(p)
    const ext = path.extname(p).slice(1)
    const base64Prefix = `data:image/${ext};base64,`
    return {
      data: base64Prefix + buffer.toString('base64'),
      size,
      path: p,
      ext
    }
  })

  return imageList
}

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const page: number = parseInt(query.page as string) || 1;
  const pageSize: number = parseInt(query.pageSize as string) || 10;

  const images = getImages(IMAGES_PATH, page, pageSize);
  
  return {
    images: images,
  };
});