
import { unit2Array, isSameColor } from './utils'


export default class ImageMap {
  width: number
  height: number
  imageData: Uint8ClampedArray
  template: number[]
  ratio: number = 20 // 比率，以100为单位，值越大，初始对比越精细
  gap: number = 0
  constructor (imageData: ImageData, template: number[], gap: number = 0) {
    const { width, height, data } = imageData
    this.width = width
    this.height = height
    this.imageData = data
    this.template = template
    this.gap = gap
  }
  getRange () {
    const colorX: number[] = []
    const colorY: number[] = []
    const perW = Math.round(this.width / this.ratio)
    const perH = Math.round(this.height / this.ratio)
    for (let i = 0; i <= this.ratio; i++) {
      for (let j = 0; j <= this.ratio; j++) {
        const x = Math.min(this.width, perW * i)
        const y = Math.min(this.height, perH * j)
        const point = this.getColor(x, y)
        const isEqual = isSameColor(point, this.template, this.gap)
        if (isEqual) {
          !colorX.includes(x) && colorX.push(x)
          !colorY.includes(y) && colorY.push(y)
        }
      }
    }
    console.log('colorX', colorX, colorY)
    // const minX = Math.min.apply(colorX)
    // const maxX = Math.max.apply(colorX)
    // const minY = Math.min.apply(colorY)
    // const maxY = Math.max.apply(colorY)
    const shodowRange = {
      minX: Math.min.apply(null, colorX),
      maxX: Math.max.apply(null, colorX),
      minY: Math.min.apply(null, colorY),
      maxY: Math.max.apply(null, colorY),
    }
    const perfectRange = this.getEdge(shodowRange)
    return perfectRange
  }
  getEdge (range: RectRange) {
    let { minX, minY, maxX, maxY } = range
    for (let y = minY - 1; y >= 0; y--) {
      let hasSameColor = false
      for (let x = 0; x < this.width; x++) {
        const point = this.getColor(x, y)
        if (isSameColor(point, this.template)) {
          hasSameColor = true
          break
        }
      }
      if (!hasSameColor) {
        minY = y
        break
      }
    }
    for (let y = maxY + 1; y < this.height; y++) {
      let hasSameColor = false
      for (let x = 0; x < this.width; x++) {
        const point = this.getColor(x, y)
        if (isSameColor(point, this.template)) {
          hasSameColor = true
          break
        }
      }
      if (!hasSameColor) {
        maxY = y
        break
      }
    }
    for (let x = maxX + 1; x < this.width; x ++) {
      let hasSameColor = false
      for (let y = 0; y < this.height; y++) {
        const point = this.getColor(x, y)
        if (isSameColor(point, this.template)) {
          hasSameColor = true
          break
        }
      }
      if (!hasSameColor) {
        maxX = x
        break
      }
    }
    for (let x = minX - 1; x >= 0; x --) {
      let hasSameColor = false
      for (let y = 0; y < this.height; y++) {
        const point = this.getColor(x, y)
        if (isSameColor(point, this.template)) {
          hasSameColor = true
          break
        }
      }
      if (!hasSameColor) {
        minX = x
        break
      }
    }
    return { minX, minY, maxX, maxY }
  }
  findEdge () {

  }
  getColor(x: number, y: number): number[] {
    const index = (y * this.width + x) * 4
    return unit2Array(this.imageData.slice(index, index +4))
  }
}