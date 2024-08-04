<template>
  <div>
    <h2>this is about page</h2>
    <h3>{{ outputRef }}</h3>
    <button @click="fetchImages">getAllImage</button>
    <img v-if="imgSrc" :src="imgSrc" />
  </div>
</template>
<script setup lang="ts">
// import { useRoute } from 'nuxt/dist/app/composables/router';
let outputRef = ref('')
const imgSrc = ref('')

onMounted(async () => {
  const route = useRoute()

  const res = await useFetch('/api/hello') as { data: Ref<string>}

  // outputRef = toRef(res.data)
  outputRef.value = res.data.value

  console.log('route', route, res)
  console.log('isref', isRef(res.data), isReactive(res.data))

  
})

const fetchImages = async () => {
  const res = await useFetch('/api/fetchImages', {
    method: 'get',
    query: {
      page: 1,
      pageSize: 10
    }
  })
  // res.data.value
  imgSrc.value = res.data.value?.images[0].data || ''
  
  console.log('Images', res.data.value)
}

</script>