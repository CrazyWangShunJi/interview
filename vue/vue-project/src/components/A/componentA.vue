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

const name = ref<string>('name')
const age = ref<number>(18)

onActivated(() => {
  console.log('ComponentA is activated')
})

onDeactivated(() => {
  console.log('ComponentA is deactivated')
})
</script>
<style lang="less">
  
</style>