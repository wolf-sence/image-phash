
const ratio = 0.1
// 通过以10%为单位进行随机抽样获取大致范围
export function getRandomPoint (w: number, h: number) {
  const dw = Math.round(w *ratio)
  const dh = Math.round(h * ratio)
}

export function unit2Array(unit: Uint8ClampedArray): number[] {
  return Array.from(unit)
}