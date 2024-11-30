<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import land from '@images/standard/land.jpg'
import { useBindClick } from '@/hooks/event'
import ImageMap from '@/utils/image'

const canvas = ref<HTMLCanvasElement |null>()
let imageData: ImageData
const imgInfo = ref<{ width: number, height: number }>()
const activeStyle = ref<{ [key: string]: string}>({})

const handleClick = (e: MouseEvent) => {
  const { offsetX, offsetY } = e
  if (imageData && imgInfo.value?.width) {
    const { width } = imgInfo.value
    const { data }  = imageData
    const r = data[(offsetY * width + offsetX) *4 + 0]
    const g = data[(offsetY * width + offsetX) *4 + 1]
    const b = data[(offsetY * width + offsetX) *4 + 2]
    const a = data[(offsetY * width + offsetX) *4 + 3]
    console.log('calc value', (offsetY * width + offsetX) *4)
    console.log('on click position', offsetX, offsetY, 'color: ', `rgba(${r}, ${g}, ${b}, ${a / 255})`)
    activeStyle.value = { 'background-color': `rgba(${r}, ${g}, ${b})` }
  }
}

onMounted(() => {
  // console.log('get canvs dom', canvas.value)
  const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.src = land
  img.onload = () => {
    console.log('img', img, img.width, img.height)
    imgInfo.value = { width: img.width, height:img.height}
    ctx.drawImage(img, 0, 0, img.width, img.height)
    imageData = ctx.getImageData(0, 0, img.width, img.height) as ImageData
    // const im = new ImageMap(imageData, [149, 236, 105, 255])
    // const { minX, minY, maxX, maxY } = im.getRange()
    // ctx.strokeStyle = 'red'
    // ctx.rect(minX, minY, maxX - minX, maxY - minY)
    // ctx.stroke()

    // console.log('imgdata', obj)
  }
  useBindClick(canvas as Ref<HTMLCanvasElement>, handleClick)
})
</script>

<template>
  <div class=" border-2 border-sky-100 mx-auto mt-10">
    <div class=" flex justify-center border-current" >
      <canvas width="1000" height="1000" ref="canvas"></canvas>
      <!-- <img src="./assets/images/img.png" alt=""> -->
      <div>
        <div class=" w-64 h-64" :style="activeStyle"></div>
        <div class=" text-base">{{ activeStyle }}</div>
      </div>
    </div>
    <h1>hello world</h1>
  </div>
</template>

<style scoped>

</style>
