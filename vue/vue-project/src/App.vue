<template>
  <div>
    <ul>
      <li v-for="item in items">{{ item.name }}</li>
    </ul>
    <button @click="moveFirstToEnd">Move First to End</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { name: 'Apple' },
        { name: 'Banana' },
        { name: 'Cherry' }
      ]
    };
  },
  methods: {
    moveFirstToEnd() {
      const firstItem = this.items.shift(); // 移除第一个元素
      this.items.push(firstItem); // 将其添加到列表末尾
    }
  }
}
</script>
