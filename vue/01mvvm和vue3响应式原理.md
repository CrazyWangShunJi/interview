## MVVM
* model: 模型 可以理解为业务中的一些数据
* view: 视图 可以理解为用户界面，即dom
* viewModel: 视图模型 可以理解为model和view直接的桥梁，将模型数据映射到视图上，同时将视图上的元素绑定到模型数据中
<br></br>

* mvvm的核心就是双向数据绑定：
* 当model中的数据发生变化时，viewModel会检测到这些数据的变化，听通过绑定机制自动更新到view视图上
* 当view中的数据发生变化时，比如用户在输入框上进行操作时，viewModel就会捕获到这些变化，然后更新到model中

## vue3 中的响应式原理
### 1. vue3通过proxy来实现数据劫持
* 以reactive为例(当ref来劫持一个对象类型的数据时，也是使用的proxy)
```js
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      // 获取劫持对象的属性的值
      const result = Reflect.get(target, key, receiver)

      // 收集依赖，当某个响应式对象被读取时，它就会记录哪个地方使用到了该数据，即依赖
      track(target, key)

      // 如果属性是对象，继续递归遍历
      // 如果是基础属性，直接返回，由此实现深层次嵌套的响应式
      return typeof target[key] === 'object'? reactive(result) : result
    },

    set(target, key, value, receiver) {
      // 旧值
      const oldValue = target[key]

      // 设置劫持对象的属性的值
      const result = Reflect.set(target, key, value, receiver)

      if (oldValue!== value) {
        // 内容发生改变，触发依赖
        trigger(target, key)
      }
    }
  })
}
```

### 2. effect track trigger
* 首先需要讲讲effect和副作用函数
* effect(fn) 接受一个回调函数，即副作用函数
* 副作用函数通常是指那些**依赖于响应式对象**的函数
* **当响应式对象数据发生变化时，这些副作用函数就会重新执行**
* 当执行effect(fn)执行，就会vue的全局变量activeEffect指向副作用函数，activeEffect表示当前正在执行的副作用函数，并执行该函数
<br></br>

* 响应式原理：
* 依赖追踪track： 当我们使用副作用函数访问响应式数据的时候，vue3就会通过track(), 将activeEffect（当前正在执行的副作用函数）与响应式数据进行关联
* 修改触发重新执行trigger：当响应式数据发生变化的时候，就会触发trigger(), trigger函数会重新执所有依赖响应式对象的副作用函数
```js
let activeEffect = undefined

function effect(fn) {
  activeEffect = fn // 将当前只在执行的副作用函数
  fn()
}

// 用于存储所有的响应式对象，以及依赖于该响应式对象的副作用函数集合
const targetMap = new WeakMap()


function track(target, key) {
  // 没有依赖关系，直接返回
  if (!activeEffect) return

  // 存储 响应式对象的 依赖映射
  let depsMap = targetMap.get(target)
  if(!depsMap) {
    targetMap.set(target, (new depsMap = new Map()))
  }

  // 存储 依赖于响应式对象的属性的副作用函数 的集合
  let dep = depsMap.get(key)
  if(!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  // 将当前的副作用函数添加到集合中
  dep.add(activeEffect)
}

function trigger(target, key) {
 // 获取当前依赖于这个响应式对象的 副作用函数的集合
 const depsMap = targetMap.get(target)

 if (!depsMap) return

 // 获取依赖于当前响应式对象的属性的 副作用函数的集合
 const effects = depsMap.get(key)

 if (effects) {
  // 执行所有的副作用函数
  effects.forEach(effect => effect())
 }
}
```