# 渲染函数
* 渲染函数 h()
* h() 返回vnode节点树。这些vnode是vue用来描述DOM结构的对象
* Vue渲染函数的本质是用js来构建和返回Vnode
<br></br>

* 例：
```js
const render = () => {
  return h('div', { class: 'hello' }, 'Hello, Vue 3!');
};
```
* 在这个例子中
* h() 接收的参数：
* * 第一个参数是标签名，
* * 第二个参数是属性对象，
* * 第三个参数是子节点或者内容（字符串、数字、另一个 VNode 或 VNode 数组）。
* 渲染函数返回一个vnode对象，vue会将这个vnode渲染成实际的dom节点

## vue3实例：
```vue
<script>
import { h, ref } from 'vue';

// 定义一个计数器状态
const count = ref(0);

// 定义一个增加计数器的函数
const increment = () => {
  count.value++;
};

// 定义一个项目列表
const items = ['Vue', 'React', 'Angular'];

// 渲染函数
const render = () => {
  // 使用 h 函数生成虚拟 DOM
  return h('div', { }, [
    h('h2', {}, 'This is rendered using a Render Function'),
    
    // 显示计数器
    h('p', {}, `Count: ${count.value}`),
    
    // 按钮，用于增加计数器
    h('button', { onClick: increment }, 'Increment'),
    
    // 动态渲染列表
    h('ul', {}, items.map(item => 
      h('li', { key: item }, item)
    ))
  ]);
};

export default render
</script>
```

# jsx
* jsx: javascript XML : 允许在js中直接写类似HTML的代码
* 上面的例子是渲染函数，用jsx可这样改写
```js
<script lang="jsx">
import { ref } from 'vue';

// 定义一个计数器状态
const count = ref(0);

// 定义一个增加计数器的函数
const increment = () => {
  count.value++;
};

// 定义一个项目列表
const items = ['Vue', 'React', 'Angular'];

// 渲染函数
const render = () => {
  return (
    <div>
      <h1>this jsx</h1>
      <p>Counter: { count.value }</p>
      <button onClick={increment}>increment</button>
      <ul>
        {items.map(item => (<li key={item}>{item}</li>))}
      </ul>
    </div>
  )
};

export default render
</script>
```