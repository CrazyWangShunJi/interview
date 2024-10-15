## vue3生命周期
### 1、setup
* 时机： 组件实例被创建之前， 在beforeCreate 和 created之间调用
* 场景： 初始化响应式数据， 定义计属性 方法等等

### 2、onBeforeMount
* 时机：此时虚拟节点(vnode)已经创建完成，但是组件还没有挂载到真实DOM上
* 此时可以做一些基础的数据操作
* 但是此时只能对vnode进行操作，不能对dom进行操作

### 3、onMounted
* 时机：组件已经被挂载到 DOM 之后，模板已经渲染为真实的 DOM。
* 可以进行 DOM 操作，或者发起网络请求（因为此时组件已被挂载，数据展示完成）。

#### 4、onBeforeUpdate
* 时机： vnode已经更新完成，但是dom还没有更新

#### 5、onUpdated
* 时机：dom已经更新完成

#### 6、onBeforeUnMount
* 时机： 实例被销毁前
* 组件即将销毁时执行一些清理操作，如移除事件监听器、移除全局事件监听器等。

#### 7、onErrorCaptured
* 在捕获了子组传递的错误时调用
* 主要用于在组件中管理和捕获错误，放在错误在整个应用程序中传播
* 如果某个子组件发生错误，通常错误会冒泡到整个组件树，导致应用崩溃。通过 onErrorCaptured，你可以捕获错误，进行相应处理（比如回退到稳定状态），防止整个应用崩溃。
```js
onErrorCaptured((error, instance, info) => {
  // 错误处理逻辑
  console.error('Captured error:', err, instance, info);
  // 返回 false 可以阻止错误冒泡
  return false;
})
```

#### 8、onAcitived & onDacitived
* onAcitived: 若组件实例是 <KeepAlive> 缓存树的一部分，当组件被插入到 DOM 中时调用。
* onDacitived: 若组件实例是 <KeepAlive> 缓存树的一部分，当组件从 DOM 中被移除时调用。

#### 9、onMounted
* 组件已经从 DOM 中移除，组件实例销毁后触发。
* 在组件彻底销毁后进行清理工作，通常是清理外部资源（如事件监听、全局状态等）。

# 父子组件的生命周期：
父 onBeforeCreate
|
父 onCreated
| 
子 onBeforeCreate
|
子 onCreated
|
父 onBeforeMount ( 这个hook在前，是因为父组件需要将vonode传递给子组件 插槽的实现原理)
|
子 onBeforeMount
|
子 onMounted
|
父 mounted

* 更新顺序
Parent beforeUpdate
Child beforeUpdate
Child updated
Parent updated