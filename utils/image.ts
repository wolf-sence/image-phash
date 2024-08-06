import { getPointColor } from './color'

export function loadNewImage (src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = src
    img.onload = () => {
      resolve(img)
    }
  })
}

const DEFAULT_SIZE = 6
type DrawPinImage = {
  ctx: CanvasRenderingContext2D,
  src: string,
  x: number,
  y: number
}
export function drawPinImage({ ctx, src, x, y }: DrawPinImage) {
  return new Promise((resolve, reject) => {
    loadNewImage(src).then(img => {
      ctx.drawImage(img, x, y, DEFAULT_SIZE, DEFAULT_SIZE)
      const imageData = ctx.getImageData(x, y, DEFAULT_SIZE, DEFAULT_SIZE)
      const { width, height, data } = imageData

      const averageList = []
      for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
          const point = getPointColor(imageData, x, y)
          // 绘制于canvas后透明度固定为1，此处不再算入计算范围
          const [r, g, b, a] = point
          const average = Math.round((r + g + b) / 3)
          averageList.push(average)
          // newImageData.push(...[average, average, average, 255])
        }
      }

      // 计算64位哈希值
      const allValue = averageList.reduce((pre, cur) => pre + cur, 0)
      const averageValue = Math.round(allValue / (DEFAULT_SIZE * DEFAULT_SIZE))
   
      const HashList = averageList.map(num => num < averageValue ? '0' : '1' )
      console.warn('hash', JSON.stringify(HashList))
      resolve(HashList)
    })
  })
}