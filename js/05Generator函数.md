* 本章主要讲到Generator函数的概念及其应用
* 在应用中会涉及到异步编程和Thunk函数
# 1 Generator函数
## 1.1、基本概念及用法
* Generator函数是ES6提供的一种异步变成解决方法，语法行为与传统函数完全不同
* Generator函数通过function*关键字定义，它可以在执行过程中暂停，并且可以恢复执行
* 这种函数的执行不是一次性完成的，而是通过生成器对象控制，每次调用生成器对象的next()方法，生成器函数会从暂停的位置继续执行，直到遇到下一个yield语句（或return语句）为止
<br></br>

* 核心特征：
* 1、它返回的是一个 迭代器对象，可以通过 next() 方法手动逐步执行。
* 2、yield 关键字用于暂停执行，并可以通过 next() 方法传递值给外部。
* 3、next() 方法的返回值是一个对象，包含两个属性：
* * value: 表示当前 yield 的返回值
* * done: 表示生成器函数是否执行完成，true 表示完成，false 表示还有后续执行。

```js
function* helloWorld() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

const gen = helloWorld()

// 通过yield暂停函数执行，这样可以在函数的执行过程中做一些事情
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())

/* 
{ value: 'hello', done: false }
{ value: 'world', done: false }
{ value: 'ending', done: true }
{ value: undefined, done: true } 
*/
```

## 1.2、yield和next
* yield关键字用于函数的暂停，并且还可以用来给外部传值（上面的例子便可以看到）
* 当函数执行到yield关键字时，会暂停执行，只有调用next()才能继续执行
* 每调用一次next(),generator函数都会执行到下一个yield表达式
* 而这个next()会返回一个对象，对象里面便包含了当前yield表达式的值和一个布尔值，该布尔值表示是否执行完成
* 由此可以看到yield可以用来给函数外部传值
* 需要注意的是，yield表达式的值，只有调用next方法时才能获取到。因此等于为JavaScript提供了手动的'惰性求值'(Lazy Evaluation)的功能。
<br></br>


* 同样的，其实next()也可以用来给函数内部传参
* yield本身没有返回值，或者说总是返回undefined
* 但是我们可是使用next来传递参数
* next()函数可以带一个参数，该参数会被当做上一个yield表达式的值
```js
function* helloWorld() {
  const res1 = yield 1 + 2
  console.log(res1) // yield本身没有返回值，且没有通过next传参，所以res1为undefined
  const res2 = yield 2 + 3
  console.log(res2) // 输出next出过来的值  即 ‘传给yield的值’
}

const gen = helloWorld()

console.log(gen.next())
console.log(gen.next())
console.log(gen.next('传给yield'))
/*
{ value: 3, done: false }
undefined
{ value: 5, done: false }
传给yield
{ value: undefined, done: true }
*/
```


## 1.3、for...of
* for...of循环可以自动遍历Generator函数生成的Iterator对象，不用调用next方法。
```js
function* gen() {
  let i = 0, j = 1
  let flag = true
  while(flag) {
    let temp = j
    j = i + j
    i = temp
    if (i > 10) {
      flag = false
    }
    yield i
  }
}

for (let i of gen()) {
  console.log(i);
}
```

## 1.4、generator函数的异步编程应用
* 在上一篇（第四篇）讲到的关于Promise中，说到Promise可以解决回调地狱的问题
* 以下面的伪代码为例
```js
// task1 task2 task3 task4均是异步任务
// 下面表示 一个异步任务接一个异步任务的完成
tasks1()
  .then(tasks2)
  .then(tasks3)
  .then(tasks4)
```
* 可以看到Promise的写法只是回调函数的改进，使用then方法以后，异步任务的按顺序执行看的更加清楚了，除此之外并无新意
* 如果还是异步任务很多，尽管使用Promise包装了一下，看上去还是一堆then
<br></br>

* 以下面为例，下面有四个Promise的异步任务
```js
function task1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('done task1')
    }, 1000)
  })
}

function task2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('done task2')
    }, 1000)
  })
}

function task3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('done task3')
    }, 1000)
  })
}

function task4() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('done task4')
    }, 1000)
  })
}

function* gen() {
  const res1 = yield task1()
  console.log(res1)
  const res2 = yield task2()
  console.log(res2)
  const res3 = yield task3()
  console.log(res3)
  const res4 = yield task4()
  console.log(res4)
}

// 全部执行这四个异步任务，简单写法
let test = gen()
test.next().value.then(data => {
  test.next(data).value.then(data => {
    test.next(data).value.then(data => {
      test.next(data).value.then(data => {
        test.next(data)
      })
    })
  })
})
/*
done task1
done task2
done task3
done task4
*/

// 可以使用函数再封装完善一下 
function runPromise(generator) {
  // runPromise接受一个generator函数作为参数
  let test = generator()

  const handle = (item) => {
    if (item.done) return item.value
    // item表示yield的返回值，是Promise对象
    // 当Promise对象状态敲定后，继续执行generator函数，并且要将上一个yield的返回的Promiose的值作为参数传递
    item.value.then((data) => handle(test.next(data)))
  }

  handle(test.next())
}
runPromise(gen)
/*
done task1
done task3
done task3
done task4
*/
```


# 2、Thunk函数
* Thunk函数的基本思想是将某个操作转换为一个不带参数的函数，当我们调用这个函数时，才会真正执行操作
* 这种方法有助于控制代码的执行时机

## 2.1 同步Thunk函数
* 举一个简单的例子：
* 假设我们有一个表达式 (a + b)，通常会在程序中立即求值。现在，我们用 Thunk 函数来延迟它的
```js
// 正常的表达式求值
const a = 3;
const b = 5;
const result = a + b; // 立即求值，result 为 8
console.log(result);  // 输出 8

// Thunk 函数
const thunk = () => a + b;  // 将表达式封装为函数
console.log(thunk);         // 输出函数本身: () => a + b
console.log(thunk());       // 调用 Thunk 函数，输出 8
```


## 2.2 异步Thunk函数
* Thunk函数在处理异步操作时非常有用，在异步场景中，Thunk函数可以封装回调函数
* 延迟执行异步操作，直到显式调用Thunk函数位置
<br></br>

* 例如：考虑一个异步场景，我们需要通过 fs.readFile 读取文件内容（假设在 Node.js 环境中）。我们可以使用 Thunk 函数来封装异步操作。
```js
const fs = require('fs')

// 普通回调方式读取文件
fs.readFile('001.txt', 'utf8', (err,data) => console.log(data))

// Thunk 函数封装异步操作
const readFileThunk = (fileName) => {
  return (callback) => {
    fs.readFile(fileName, 'utf8', callback)
  }
}
// 使用 Thunk 函数读取文件
const readFile = readFileThunk('001.txt')
readFile((err, data) => console.log(data))
```

## 2.3 Generator和Thunk函数结合实现异步控制
```js
const fs = require('fs')

// Thunk 函数封装异步操作
const readFileThunk = (fileName) => {
  return (callback) => {
    fs.readFile(fileName, 'utf8', callback)
  }
}

// generator函数
function* readFiles() {
  const data1 = yield readFileThunk('001.txt');
  console.log('001.txt ', data1)

  const data2 = yield readFileThunk('002.txt');
  console.log('002.txt ', data2)
}

// 自动执行Generator函数
function run(generator) {
  const it = generator()

  function next(err, data) {
    const result = it.next(data) // 将上次 yield 的返回值传给 Generator
    if (result.done) return
    result.value(next)  // 执行 Thunk 函数
  }

  next()
}
run(readFiles)

// 上述代码相当于下面这个：
const gen = readFiles()
gen.next().value((err,data) => {
  gen.next(data).value((err,data) => {
    gen.next(data)
  })
})
```