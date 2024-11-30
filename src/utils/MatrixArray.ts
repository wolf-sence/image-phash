import { flatten, flatMapDeep } from 'lodash-es'
import { getAverage, getConnectionLine, getRectRange } from './utils'

interface CircleOption {
  cb: Function
  x?: number
  y?: number
}
class MatrixArray {
  private arr: Array<Array<number>>
  constructor () {
    this.arr = []
  }
  fillBlank (x: number, y: number, isForce: boolean = false) {
    for (let j = 0; j < y; j++) {
      if (!this.arr[j]) {
        this.arr[j] = new Array(x).fill(0)
      } else if (this.arr[j].length < x) {
        if (!isForce) {
          const length = x - this.arr[j].length
          this.arr[j].push(...new Array(length).fill(0))
        } else {
          this.arr[j] = new Array(x).fill(0)
        }
      }
    }
  }
  toFlat (): Array<number> {
    return flatten(this.arr)
  }
  doubleCicle (options: CircleOption) {
    const { cb } = options
    const y = this.arr.length
    for(let j = 0; j < y; j++) {
      const x = this.arr[0].length
      for(let i = 0; i < x; i++) {
        cb(i, j)
      }
    }
  }
  restore (): void {
    this.arr = []
  }
}
// 三维数组数据结构，将Uint8ClampedArray可读化
class ThreeDimensionalArray {
  private arr: Array<Array<Array<number>>>
  constructor (x: number, y: number) {
    this.arr = Array.from({ length: y }, () => Array.from({ length: x}, () => [0, 0, 0, 0]))
  }
  public get (x: number, y: number): number[] {
    return this.arr[y][x]
  }
  public getMatrix (range: RectRange) {
    const { minX, minY, maxX, maxY } = range
    const result = []
    for (let y = minY; y < maxY; y++) {
      result.push(this.arr[y].slice(minX, maxX))
    }
    return result
  }
  public set (x: number, y: number, value: Array<number>) {
    this.arr[y][x] = value
  }
  public setMatrix (value: number[], range: RectRange) {
    const { minX, minY, maxX, maxY } = range
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        this.set(x, y, value)
      }
    }
  }
  public toFlat (): Array<number> {
    return flatMapDeep(this.arr)
  }
}

export default class {
  private mousePaths: Array<{ x: number, y: number}> = []
  private maximum: { [key: string]: number } = {}
  private mosaicMatrix: ThreeDimensionalArray // 打码像素三维数据缓存
  private canvasMatrix: ThreeDimensionalArray // 源图像素三维数据
  private width: number
  private height: number
  private radius: number // 打码画笔半径
  private mouseOffset: number // 鼠标偏移量：通常以画笔为准

  constructor (imageData: ImageData, radius: number = 8, mouseOffset = 0) {
    const { width, height, data } = imageData
    this.width = width
    this.height = height
    this.radius = radius
    this.mouseOffset = mouseOffset
    // this.mousePaths = [{ x, y }]
    // this.maximum = { minX: x, maxX: x, minY: y, maxY: y }
    this.mosaicMatrix = new ThreeDimensionalArray(this.width, this.height)
    this.canvasMatrix = new ThreeDimensionalArray(this.width, this.height)
    this.initMosaic(imageData)
  }
  // 初始化源数据，并打成三维数组
  private initMosaic (imageData: ImageData) {
    for (let y = 0; y < this.height; y += this.radius) {
      const ey = y + this.radius >= this.height - 1 ? this.height - 1 : y + this.radius
      for (let x = 0; x < this.width; x += this.radius) {
        const ex = x + this.radius >= this.width - 1 ? this.width - 1 : x + this.radius
        const range = {
          minX: x,
          maxX: ex,
          minY: y,
          maxY: ey
        }
        const value: number[] = getAverage(imageData, range)
        this.mosaicMatrix.setMatrix(value, range)
      }
    }
  }
  // 记录用户mouse的路径，并且将断点补充
  recordLine(x: number, y: number, isStart = false) {
    // 避免断连，需要计算连续度
    const endPoint = this.mousePaths[this.mousePaths.length - 1]
    const func = (point: PointType) => {
      this.renderPoint(point.x, point.y)
      this.mousePaths.push(point)
    }
    if (!endPoint || isStart) { // 第一次落点
      func({ x, y })
    } else {
      // 补充断点
      const moveLine = getConnectionLine(endPoint, { x, y })
      // 根据轨迹计算绘制范围
      moveLine.forEach(func)
    }
  }
  // 计算某一个指定点 所带出来的需要绘制计算的矩阵
  private renderPoint (x: number, y: number) {
    const offsety = y + this.mouseOffset || 0
    const offsetx = x + this.mouseOffset || 0
    for (let j = offsety - this.radius; j <= offsety + this.radius; j ++) {
      if (j < 0 || j >= this.height) continue
      for (let i = offsetx - this.radius; i <= offsetx +this.radius; i ++) {
        if (i < 0 || i >= this.width) continue
        if (this.canvasMatrix.get(i, j)[3] !== 0) return
        this.canvasMatrix.set(i, j, this.mosaicMatrix.get(i, j))
      }
    }
  }
  // 根据记录的鼠标路径，获取需要绘制的最小矩阵数据
  getRectImageData () {
    const xArr = this.mousePaths.map(({ x }) => x)
    const yArr = this.mousePaths.map(({ y }) => y)
    const rect = getRectRange(xArr, yArr)
    rect.minY = rect.minY - this.radius + this.mouseOffset || 0,
    rect.maxY = rect.maxY + this.radius + this.mouseOffset > this.height ? this.height : rect.maxY + this.radius + this.mouseOffset
    rect.minX = rect.minX = this.radius + this.mouseOffset || 0,
    rect.maxX = rect.maxX + this.radius + this.mouseOffset > this.width ? this.width : rect.maxX + this.radius + this.mouseOffset

    const colorArr =  this.canvasMatrix.getMatrix(rect)
    // console.log('data---', colorArr.length, rect)
    return {
      data: new ImageData(new Uint8ClampedArray(flatMapDeep(colorArr)), rect.maxX - rect.minX, rect.maxY - rect.minY),
      x: rect.minX,
      y: rect.minY
    }
  }
  // 将三维数组打平，得到的一维数组即可以putImageData至画布
  toFlat () {
    return this.mosaicMatrix.toFlat()
  }
}
