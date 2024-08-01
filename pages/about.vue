<template>
  <div>
    <h2>this is about page</h2>
    <h3>{{ outputRef }}</h3>
  </div>
</template>
<script setup lang="ts">
// import { useRoute } from 'nuxt/dist/app/composables/router';
let outputRef = ref('')
onMounted(async () => {
  const route = useRoute()

  const res = await useFetch('/api/hello') as { data: Ref<string>}

  // outputRef = toRef(res.data)
  outputRef.value = res.data.value

  console.log('route', route, res)
  console.log('isref', isRef(res.data), isReactive(res.data))
})

</script>