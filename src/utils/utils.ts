
function isSameValue (value: number, tValue: number, gap: number = 0, isForce: boolean = false): boolean { 
  if (!isForce) {
    return (tValue - gap) <= value && value <= (tValue + gap)
  } else {
    return value === tValue
  }
}

export function isSameColor(
  point: number[],
  template: number[],
  gap: number = 0,
  isForce: boolean = false,
) {
  if (!point.length || !template.length) return false
  return point.every((v, i) => {
    return isSameValue(v, template[i], gap, isForce)
  })
}

export function unit2Array(unit: Uint8ClampedArray): number[] {
  return Array.from(unit)
}

export function getPointColor (imgData: ImageData, x: number, y: number): number[] {
  const { width, data } = imgData
  const index = (y * width + x) * 4
  return unit2Array(data.slice(index, index +4))
}

export function getAverage (imgData: ImageData, matrix: RectRange): number[] {
  const { width, height } = imgData
  const { minX, minY, maxX, maxY } = matrix
  const rgb = [0, 0, 0]
  let index = 0
  for (let j = minY; j <= maxY; j ++) {
    for (let i = minX; i <= maxX; i ++) {
      if (j * i <= 0 || j >= height || i >= width) {
        continue
      } else {
        const point = getPointColor(imgData, i, j)
        for (let k = 0; k < 3; k ++) {
          rgb[k] += point[k]
        }
        index ++
      }
    }
  }
  const average = rgb.map(n => Math.round(n / index))
  return [...average, 255]
}

export function getRangeAverageColor (imgData: ImageData, x: number, y: number, radius = 1): number[] {
  const matrix = {
    minX: x - radius,
    maxX: x + radius,
    minY: y - radius,
    maxY: y + radius
  }
  return getAverage(imgData, matrix)
}

// 在两点之间找到一条连通的线段
export function getConnectionLine (endPoint: PointType, targetPoint: PointType): PointType[] {
  const { x: ex, y: ey } = endPoint
  const { x: tx, y: ty } = targetPoint
  const lineCoordinates = [];

  const dx = Math.abs(tx - ex);
  const dy = Math.abs(ty - ey);
  const sx = (tx - ex) < 0 ? -1 : 1;
  const sy = (ty - ey) < 0 ? -1 : 1;

  let err = dx - dy;
  let x = ex;
  let y = ey;

  while (x !== tx || y !== ty) {
    lineCoordinates.push({ x, y });
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
  lineCoordinates.push({ x: tx, y: ty });
  return lineCoordinates.slice(1);
}

export function getRectRange(xArr: number[], yArr: number[]): RectRange {
  return {
    minX: Math.min.apply(null, xArr),
    maxX: Math.max.apply(null, xArr),
    minY: Math.min.apply(null, yArr),
    maxY: Math.max.apply(null, yArr),
  }
}

