# vue3和vue3的区别
## 1、响应式
* vue2基于Object.defineProperty实现响应式
* vue3基于Proxy来实现

### Object.defineProperty
###### 基本用法
```js
let obj = {
  a: 1,
  b : {
    c: 2,
    d: 4
  }
}

// 实现数据接触
Object.defineProperty(obj, 'a', {
  get() {
    // 当依赖访问该响应式数据时，进行一个数据劫持
  },
  set() {
    // 当数据发生变化时通知所有依赖
  }
})
```

##### 缺点
* 1、一次只能劫持一个属性
* 如果想多次劫持一个属性，需要多次调用
```js
function defineProperty(obj, key) {
  Object.defineProperty(obj, key, {
    get() {
      // 当依赖访问该响应式数据时，进行一个数据劫持
    },
    set() {
      // 当数据发生变化时通知所有依赖
    }
  })
}

function obeserve(obj) {
  Object.keys(obj).forEach(key => {
    defineProperty(obj, key)
  })
}
```
<br></br>

* 2、无法深层次嵌套监听对象的属性
* 如果需要深层次嵌套监听，比较麻烦
```js
function defineProperty(obj, key) {
  let val = obj[key]

  if (Object.prototype.toString.call(val).slice(8, -1) === 'Object') {
    // 递归监听
    obeserve(val)
  }

  Object.defineProperty(obj, key, {
    get() {
      // 收集依赖
  
      return val
    }, 
    set() {
      // 通知依赖
      
      if (Object.prototype.toString.call(val).slice(8, -1) === 'Object') {
        // 递归监听
        obeserve(val)
      }
    }
  })

}

function obeserve(obj) {
  Object.keys(obj).forEach(key => {
    defineProperty(obj, key)
  })
}
```
<br></br>

* 3、无法监听属性的新增或者删除
* **在vue中，使用Vue.set 以及 Vue.delete 来手动实现对象添加或者删除响应式的数据**

* 4、无法直接监听数组的索引变化或者长度变化
* 为了应对 Object.defineProperty 无法监听数组索引和长度变化的问题
* **Vue 2 通过重写数组的一些原型方法（如 push、pop、shift、unshift、splice、sort、reverse）**来保证这些数组操作是响应式的。


### Proxy
##### 基本使用
```js
let a = {
  b: 1,
  c : {
    d: 2
  }
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 收集依赖
      track(target, key)

      return Reflect.get(target, key, receiver)
    },
    set(target, key, value,  receiver) {
      if (value !== target[key]) {
        // 通知依赖
        // 如果值发生变化
        triggert()
      }
      return Reflect.set(target, key, receiver)
    }
  })
}
```


##### 优点
* 1、直接监听整个对象，而且需要递归监听对象的属性
<br></br>

* 2、可以直接监听对象属性的新增和删除
* 无需手动使用Vue.set和Vue.delete
<br></br>

* 3 直接监听数组索引和长度变化
* 无需从数据原型上改变数组的方法
<br></br>

* 4 支持更多的拦截操作
* 具有更多的api
* Proxy有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等是Object.defineProperty不具备的。


## 2、composition API
* 1、vue2，使用选项式API（data, methodsl, computed, props等）
* 每个选项都封装了特定的功能，然后vue再将这些选项全部挂到组件实例this上
* 这样一来逻辑就比较分散，这是缺点之一
<br></br>

* 当需要复用逻辑时，通常需要使用mixins, 但是mixins存在命名冲突和逻辑不清晰问题
<br></br>

* 2、vue3，使用组合式API
* 不再是将逻辑按选项分开，而是通过setup函数集合管理组件
* 所有的响应式状态，计算属性、方法都可以在setup函数中声明和组织
* 这样一来逻辑更清晰： 相关逻辑可以集中在一起，代码更容易理解和维护，特别是在大型组件中，组合式 API 能避免逻辑分散。
* 而且逻辑复用更简单： 可以通过自定义的函数、composables 等轻松复用逻辑，而不依赖 mixins。
<br></br>

* 注：
* setup函数是组件的入口，它在组件实例创建之前执行，因此this并不指向组件组件实例对象this
* 如果想访问组件实例对象 调用 getCurrentInstance()