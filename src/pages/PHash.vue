<script setup lang="ts">
import { loadNewImage } from '@/utils/tools';
import { getPointColor } from '@/utils/utils';
import png from '@/assets/bg3.jpg'
import { onMounted, ref } from 'vue';

const canvas = ref<HTMLCanvasElement |null>()
const canvasX = 100
const distant = 128

const hashArr = ref<Array<String>>(["1","1","1","0","0","0","0","0","1","1","1","1","1","0","0","0","0","0","0","1","0","0","0","0","1","0","0","1","1","1","0","0","1","1","1","1","1","1","1","0","1","1","1","0","1","1","0","0","0","1","0","0","0","0","1","1","0","0","0","0","1","1","1","0"])

onMounted(() => {
  
  loadNewImage(png).then(img => {
    const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D
    ctx.drawImage(img, canvasX, 100, distant, distant)
    const imageData = ctx.getImageData(canvasX, 100, distant, distant)
    const { width, height, data } = imageData
    const newImageData = []
    const averageList = []
    for(let i = 0; i < width; i++) {
      for(let j = 0; j < height; j++) {
        const point = getPointColor(imageData, j, i)
        const [r, g, b, a] = point
        const average = Math.round((r + g + b) / 3)
        averageList.push(average)
        newImageData.push(...[average, average, average, 255])
      }
    }
    console.log('----', imageData, newImageData)
    const newImage = new ImageData(new Uint8ClampedArray(newImageData), width, height)
    ctx.putImageData(newImage, canvasX, 300)

      // 计算64位哈希值
      // const allValue = averageList.reduce((pre, cur) => pre +cur, 0)
      // const averageValue = Math.round(allValue / 64)
      // let hash = averageList.reduce((pre, cur) => {
      //   hashArr.value.push(pre + (cur < averageValue ? '0' : '1'))
      //   return pre
      // }, '')
      // console.warn('hash', hash, JSON.stringify(hashArr.value))
  })
})
</script>

<template>
  <div class=" border-2 border-sky-100 mx-auto mt-10">
    <div class=" flex justify-center border-current" >
      <canvas width="300" height="600" ref="canvas"></canvas>
      <p class=" pt-72 pl-16 tracking-widest">
        <template v-for="(item, index) in hashArr" :key="index">
          <span class=" w-10">{{ item  }}</span>
          <br v-if="(index + 1) % 8 === 0 && index !== 0">
        </template>
        
      </p>
      <!-- <img src="./assets/images/img.png" alt=""> -->
    </div>
    <h1>hello <br> world</h1>
  </div>
</template>