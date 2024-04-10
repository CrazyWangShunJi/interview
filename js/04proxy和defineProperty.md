# 1 Obejct.defineProperty
## 1 基本使用
* 在一个对象上定义一个属性，或者修改一个对象的现有属性，并返回这个对象
```js
let person = {}
let personName = 'lihua'

Object.defineProperty(person, 'namep', {
  get: function() {
    console.log('触发了get方法')
    return personName
  },
  set: function(val) {
    console.log('触发了set方法');
    personName = val
  }
})

//当读取person对象的namp属性时，触发get方法
console.log(person.namep)

//当修改personName时，重新访问person.namep发现修改成功
personName = 'liming'
console.log(person.namep)

// 对person.namep进行修改，触发set方法
person.namep = 'huahua'
console.log(person.namep)
```

## 2 监听多个属性
* Object.defineProperty只能监听一个属性的变化，如果需要监听多个属性的话，比较麻烦
* 得设置一个中转的oberserver