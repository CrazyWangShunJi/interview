### 虚拟dom
* 虚拟dom是一棵用js对象来表示的dom树，每一个虚拟dom节点都是对真实dom的描述，这些描述包括节点类型、属性、子节点等信息
<br></br>

* 主要作用：
* 真实操作dom是非常耗费性能的，尤其是频繁更新会导致浏览器进行多次的重绘和回流。
* 为了优化这一过程，vue采用了虚拟dom来描述视图，通过diff算法对比新旧虚拟dom树，vue可以计算出最小的dom变化，然后批量更新真实dom


### vue的dom更新机制
#### 1、数据变化：
* 当vue组件中的响应式数据发生变化时，vue并不会立即更新dom，它会将所有的数据变化放入一个异步队列中（微任务）。
* 并在下一个事件循环中一次性更新DOM
* 之所以是要使用异步队列，是为了避免一次操作中频繁修改响应式数据，导致dom频繁变化，从而影响性能。
```js
data() {
  return {
    count: 0
  };
},

methods: {
  increment() {
    this.count++;
    this.count++;
    this.count++;
    console.log(this.count);  // 输出: 0 (异步更新还未触发)
  }
}
```
* 在上面这个例子中，尽管连续三次修改count， 但是最终只会在下一次事件循环中更新一次dom

#### 2、Promise.then - vue的异步更新机制
* vue内部的dom更新是微任务的，具体来说是使用Promise.then来实现的
* 它的核心代码是这样的
```js
let pending = false; // 用来标记是否有异步更新任务正在等待执行
const queue = []; // 用来存储所有的更新回调函数

// 负责清空队列并执行所有的更新回调函数
function flushQueue() {
  pending = false; // 重置标记，表示更新任务已经执行完
  const copies = queue.slice(0); // 复制当前队列，防止在执行过程中有新的任务添加进来
  queue.length = 0; // 清空队列
  for (let i = 0; i < copies.length; i++) {
    copies[i](); // 执行每一个更新回调函数
  }
}

// 向队列中添加更新任务，并通过 Promise.then() 进行异步处理
function queueUpdate(callback) {
  if (!pending) {
    pending = true; // 标记更新任务已经在等待执行
    // 使用 Promise.then() 创建一个微任务，异步执行队列中的更新
    Promise.resolve().then(flushQueue);
  }
  queue.push(callback); // 将更新回调函数加入队列
}
```
<br></br>

* vue更新的具体的事件循环如下：
* 1、执行同步代码
* 2、执行所有的微任务（例如Promise.then）
* 3、渲染页面
* 4、执行下一个宏任务（礼物 setTimeout）

#### 3、nextTick
* 在一些情况下，你需要在DOM更新后就执行某些操作，这个时候可以使用nextTick()
```html
<script setup>
import { ref, nextTick } from 'vue'

const count = ref(0)

async function increment() {
  count.value++

  // DOM 还未更新
  console.log(document.getElementById('counter').textContent) // 0

  await nextTick()
  // DOM 此时已经更新
  console.log(document.getElementById('counter').textContent) // 1
}
</script>

<template>
  <button id="counter" @click="increment">{{ count }}</button>
</template>
```

#### 4、diff算法
diff算法的原理如下：
* 1、vue的diff算法从根节点开始，逐层对比新旧虚拟DOM树。在同一层级，比较每个节点的属性、类型和子节点
* * 如果节点类型相同，diff算法就会继续比较节点的属性和值，并根据差异只更新变化的部分
* * 如果节点类型相同，vue就会认为它们是完全不同的元素，就会直接删除旧节点
<br></br>

* 2、子节点比较：
* 当一个节点的类型相同时，vue还会进一步比较他们的子节点，这时候采用的时双端对比法：
* 同时从头部和尾部进行比较，尽可能地复用现有的 DOM 节点，减少不必要的 DOM 创建和删除操作。
* 即有四种比较策略：新前 vs 旧前、新后 vs 旧后、新前 vs 旧后、新后 vs 旧前，根据匹配结果来服用或者移动节点
* 处理剩余节点：如果在比较过程中有未处理的节点，直接删除旧的未匹配节点或添加新的未匹配节点。
<br></br>

* 为什么需要key?
* vue在使用diff算法时，key是用来唯一标识节点的。如果标签名相同，key也相同，就会认为是同一节点
* vue使用key更够高效的追踪节点的变化：
* 以下面情况为例：
* 旧列表：[li1, li2, li3, li4]
* 新列表：[li1, li2, li5, li3, li4]
* 如果不使用key：进行比较时li1, li2 就不会重新渲染，但是li3, li4, li5 都会重新渲染，因为li5从中间插入了，导致index发生了变化，所以li3 li4 li5的位置都发生了变化，所以要全部更新
* 但是如果使用唯一标识作为key的情况下，就可以避免这种情况，只需要重新渲染li5就可以了
<br></br>