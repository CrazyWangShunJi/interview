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

