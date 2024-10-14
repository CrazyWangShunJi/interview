<template>
  <button @click='change("A")'>go to form</button>
  <button @click='change("B")'>go to otherPage</button>

  <router-view v-slot="{ Component }">
    <KeepAlive include="componentA">
      <component :is="Component" />
    </KeepAlive>
  </router-view>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()

const change = (name: string) => {
  router.push({name})
}
</script>
<style lang="">
  
</style>