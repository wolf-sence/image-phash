import fs from 'fs'

export function isFileExit(filePath: string) {
  try {
    const stat = fs.statSync(filePath)
    return stat
  } catch {}
}

export function getFileSync(filePath: string) {
  const stat = isFileExit(filePath)
  if (stat?.size) {
    const data = fs.readFileSync(filePath)
    return {
      buffer: data,
      size: stat.size,
      path: filePath
    }
  } else {
    return {}
  }
}

export function saveFile(filePath: string, data: unknown) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (e) => {
      if (e) {
        console.error('write file fail', e)
        reject(e)
      } else {
        console.log('write file success')
        resolve(filePath)
      }
    })
  })
}

export function getFileMimeType(ext: string) {
  let mimeType = ''
  let e = ext.toLowerCase()
  if (e.startsWith('.')) {
    e = e.slice(1)
  }
  switch (e) {
    case 'svg':
      mimeType = 'image/svg+xml';
      break;
    case 'png':
      mimeType = 'image/png';
      break;
    case 'jpg':
    case 'jpeg':
      mimeType = 'image/jpeg';
      break;
    default:
      break;
  }
  return mimeType
}