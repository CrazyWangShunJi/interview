# 1 keepAlive
* keepAlive 主要用于缓存动态组件，或者路由组件，使其在路由切换时不被销毁，从而保持组件状态
* 当使用 <keep-alive> 包裹组件时，被缓存的组件会在切换时保留它们的状态、数据、DOM 元素和当前的生命周期，不会因为切换而重新创建或销毁。
<br></br>

* keepAlive常见属性：
* include：根据组件的name进行匹配，指定哪些组件应该被缓存。
* exclude：根据组件的name进行匹配，指定哪些组件不应该被缓存。
* max：数字，指定最多可以缓存多少个组件，超出这个数量时，最久没有使用的缓存组件会被移除。

## 基本使用：
* 下面的例子是在app.vue中，切换A,B两个组件
* 其中缓存A组件中的数据，不缓存B组件中的数据

* app.vue:
```vue
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
```
<br></br>

* A.vue:
```vue
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
```
<br></br>

* B.vue:
```vue
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

</script>
<style lang="less">
  
</style>
```

## 应用场景：
* 1、数据缓存：例如在表单页面，如果用户在填写表单时切换到了其他页面，使用 keep-alive 可以确保用户返回时表单数据保持不变，而不会因为重新渲染而丢失。
<br></br>

* 2、高频切换:
* 在应用中有一些高频切换的内容，例如导航菜单之间的切换，使用 keep-alive 可以避免重复加载，提高性能。例如在后台管理系统中，用户频繁在不同的功能页面间切换，keep-alive 可以避免每次切换时页面重新加载，提升用户体验。
