<script setup lang="ts">
  import { ref } from 'vue';
  import { routes } from './router';
  const routers = ref<Array<{ [key: string]: any}>>(routes)
</script>
<template>
  <div>
    <RouterView></RouterView>
    <div class=" flex justify-between text-base px-24">
      <RouterLink
        v-for="route in routers"
        :key="route.path"
        class=" text-slate-900 underline hover:text-yellow-500"
        :to="route.path">
        {{ route.name }}
      </RouterLink>
    </div>
  </div>
</template>
