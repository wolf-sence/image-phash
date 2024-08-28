<template>
  <div>
    <h2>this is preview page</h2>
    <button @click="fetchImages">getAllImage</button>
    <div>
      <canvas width="400" height="400" ref="canvas" style="border: 1px solid gray;"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { drawPinImage, DEFAULT_SIZE } from '~/utils/image'
import { ref } from 'vue';
const canvas = ref<HTMLCanvasElement | null>()

const SPACE = 10

const fetchImages = async () => {
  const { data } = await useFetch('/api/fetchImages', {
    method: 'get',
    query: {
      page: 1,
      pageSize: 10
    }
  })
  const list = data.value?.images || []
  console.log('list', list)
  const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D
  let index = 0
  list.forEach((item) => {
    index += DEFAULT_SIZE + SPACE
    const x = index
    const y = 10
    drawPinImage({ ctx, src: item.data, x, y }).then(res => {
      // 每张图独立处理结果
      console.log('get data', res)
    })
  })
  
}
</script>