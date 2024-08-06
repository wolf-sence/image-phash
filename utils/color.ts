export function unit2Array(unit: Uint8ClampedArray): number[] {
  return Array.from(unit)
}

export function getPointColor (imgData: ImageData, x: number, y: number): number[] {
  const { width, data } = imgData
  const index = (y * width + x) * 4
  return unit2Array(data.slice(index, index +4))
}