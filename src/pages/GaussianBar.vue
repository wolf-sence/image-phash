<script lang="ts" setup>
import { ref, onMounted, type Ref, render } from 'vue'
import png from '@/assets/bg3.jpg'
import { loadNewImage } from '@/utils/tools'
import MatrixArray from '@/utils/MatrixArray'
import { useBindClick } from '@/hooks/event'
import { getRangeAverageColor, getPointColor } from '@/utils/utils'

const canvas = ref<HTMLCanvasElement |null>()
const coverCanvas = ref<HTMLCanvasElement |null>()

let imageData: ImageData
onMounted(() => {
  loadNewImage(png).then((img: HTMLImageElement) => {
    const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D
    const gbCtx = coverCanvas.value?.getContext('2d') as CanvasRenderingContext2D
    const startTime = Date.now()
    ctx.drawImage(img, 0, 0, img.width, img.height)
    imageData = ctx.getImageData(0, 0, img.width, img.height)
    // console.log('coverCanvas imagedata', gbCtx.getImageData(0, 0, img.width, img.height))
    const { data } = imageData
    const arr = []
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const point = getRangeAverageColor(imageData, x, y, 5)
        arr.push(...point)
      }
    }
    const newU8 = new Uint8ClampedArray(arr)
    console.warn('iiii', data, imageData)
    const newImageData = new ImageData(newU8, img.width, img.height)
    // const newImageData = new ImageData(newU8, 42, 130)
    gbCtx.putImageData(newImageData, 0, 0)
    console.warn('time stamp', Date.now() - startTime)
  })
})

const trigger = (e: MouseEvent) => {
  const { offsetX, offsetY } = e
  const arr = getPointColor(imageData, offsetX, offsetY)
  console.log('eee', offsetX, offsetY, `rgba(${arr.join(', ')})`)
}

</script>
<template>
  <div>
    <h2>高斯模糊</h2>
    <div class=" c-pointer flex">
      <canvas width="600" height="600" ref="canvas" @click="trigger"></canvas>
      <canvas width="600" height="600" ref="coverCanvas" class=" left-0 top-0 z-10"></canvas>
    </div>
  </div>
</template>

<style>
.c-pointer {
  cursor: url('../assets/images/s-cursor.png'), pointer;
}
</style>