<template>
  <div>
    Form
  </div>
  <br></br>

  <input v-model="name" placeholder="name">
  <br></br>

  <input v-model="age" placeholder="age">
</template>
<script setup lang="ts">
import { ref, onActivated, onDeactivated } from 'vue'

const name = ref<string>('xxx')
const age = ref<number>(23)

onActivated(() => {
  console.log('Componentb is activated')
})

onDeactivated(() => {
  console.log('Componentb is deactivated')
})
</script>
<style lang="less">
  
</style>