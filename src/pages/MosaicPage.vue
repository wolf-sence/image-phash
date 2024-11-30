<script lang="ts" setup>
import { ref, onMounted, type Ref, render } from 'vue'
import png from '@/assets/bg3.jpg'
import { loadNewImage } from '@/utils/tools'
import MatrixArray from '@/utils/MatrixArray'
import { useBindClick } from '@/hooks/event'
import { getRangeAverageColor, getPointColor } from '@/utils/utils'

const canvas = ref<HTMLCanvasElement |null>()
const coverCanvas = ref<HTMLCanvasElement |null>()
const radius = 8
let imageData: ImageData
let matrixArr: MatrixArray



onMounted(() => {
  loadNewImage(png).then((img: HTMLImageElement) => {
    const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D
    const gbCtx = coverCanvas.value?.getContext('2d') as CanvasRenderingContext2D
    const startTime = Date.now()
    ctx.drawImage(img, 0, 0, img.width, img.height)
    imageData = ctx.getImageData(0, 0, img.width, img.height)
    matrixArr = new MatrixArray(imageData, radius, 8)
  
    coverCanvas.value?.addEventListener('mousedown', (e: MouseEvent) => {
      
      const { offsetX: startX, offsetY: startY } = e
      matrixArr.recordLine(startX, startY, true)
      let renderTag: number = 0
      const triggerRender = () => {
        if (renderTag) return
        renderTag = window.requestAnimationFrame(() => {
          const { data, x, y } = matrixArr.getRectImageData()
          gbCtx.putImageData(data, x, y)
          window.cancelAnimationFrame(renderTag)
          renderTag = 0
        })
      }
      
      const onMouseMove = (e: MouseEvent) => {
        const { offsetX: x, offsetY: y } = e
        matrixArr.recordLine(x, y)
        triggerRender()
      }
      const onMouseLeave = (e: MouseEvent) => {
        triggerRender()
        console.log('cancel')
        coverCanvas.value?.removeEventListener('mousemove', onMouseMove)
        coverCanvas.value?.removeEventListener('mouseup', onMouseLeave)
        coverCanvas.value?.removeEventListener('mouseleave', onMouseLeave)
      }
      coverCanvas.value?.addEventListener('mousemove', onMouseMove)
      coverCanvas.value?.addEventListener('mouseup', onMouseLeave)
      coverCanvas.value?.addEventListener('mouseleave', onMouseLeave)
    })
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
    <div class=" c-pointer relative">
      <canvas width="600" height="600" ref="canvas" @click="trigger"></canvas>
      <canvas width="600" height="600" ref="coverCanvas" class=" absolute left-0 top-0 z-10"></canvas>
    </div>
    <div class=" w-40 h-40 flex justify-center items-center bg-slate-400 ml-10 mb-10">
      <div class=" w-28 h-28 bg-slate-800"></div>
    </div>
  </div>
</template>

<style>
.c-pointer {
  cursor: url('../assets/images/s-cursor.png'), pointer;
}
</style>