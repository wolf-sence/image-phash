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
import { drawPinImage } from '~/utils/image'
import { ref } from 'vue';
const canvas = ref<HTMLCanvasElement | null>()

const fetchImages = async () => {
  const { data } = await useFetch('/api/fetchImages', {
    method: 'get',
    query: {
      page: 1,
      pageSize: 10
    }
  })
  const list = data.value?.images || []
  const ctx = canvas.value?.getContext('2d') as CanvasRenderingContext2D
  drawPinImage({ ctx, src: list[0].data, x: 10, y: 10 }).then(res => {
    console.log('get data', res)
  })
}
</script>