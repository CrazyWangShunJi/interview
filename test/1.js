let cls = {
  name: 'xxx',
  get teacher() {
    return this.name
  }
}

let cls2 = {
  name: 'yyy'
}
// Reflect 一部分的替代了 Object 的一些方法
console.log(Reflect.get(cls, 'name')) // xxx
// Reflect.get(target, propertyKey, receiver), 第三个参数是一个对象，作为函数的 this 指向
console.log(Reflect.get(cls, 'teacher', cls2)) // xxx
