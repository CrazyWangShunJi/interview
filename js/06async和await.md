# 1、基本概念及用法
* async 和 await 是用于简化 JavaScript 异步编程的语法糖，它们基于 Promise，提供了一种以同步风格编写异步代码的方式。
<br></br>

* async函数： 用来声明一个函数是异步的。async函数总是返回一个Promise,即使函数内部没有显示返回Promise
* **这个返回的值类似于被Promise.resolve()包裹**
* 备注：即使异步函数的返回值看起来像是被包装在了一个 Promise.resolve 中，但它们不是等价的。
* 如果给定的值是一个 promise，异步函数会返回一个不同的引用，而 Promise.resolve 会返回相同的引用，
```js
const p = new Promise((res, rej) => {
  res(1);
});

async function asyncReturn() {
  return p;
}

function basicReturn() {
  return Promise.resolve(p);
}

console.log(p === basicReturn()); // true
console.log(p === asyncReturn()); // false
```
<br></br>

* await表达式：只能在 async 函数中使用，用来等待一个 Promise 完成。await 会暂停函数的执行，直到 Promise 完成，返回该 Promise 的解析值。
* 基本用法：
```js
// 一个模拟异步操作的函数，返回一个 Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('数据已获取');
    }, 2000);  // 模拟2秒的延迟
  });
}

// 使用 async/await 来处理异步函数
async function getData() {
  console.log('开始获取数据...');
  
  const result = await fetchData();  // 暂停直到 fetchData() 完成
  console.log(result);  // 输出 '数据已获取'
  
  console.log('数据处理完成');
}

getData();
```

# 2、手动实现async/await
* 前面的文章我说到了generator函数，其实我们可以使用generator函数配合Promise来模拟async/await的功能
```js
function asyncGenerator(generatorFunc) {
  return function () {
    const generator = generatorFunc.apply(this, arguments);

    function handle(result) {
      // 如果 Generator 执行完毕，返回一个已完成的 Promise
      if (result.done) return Promise.resolve(result.value);

      // 否则，处理 Promise，并在其完成后继续 Generator
      return Promise.resolve(result.value).then(
        res => handle(generator.next(res)),
        err => handle(generator.throw(err))
      );
    }

    // 启动 Generator
    return handle(generator.next());
  };
}

// 使用模拟的 async/await 实现
const asyncFunc = asyncGenerator(function* () {
  try {
    const data = yield fetchData();  // yield 返回一个 Promise
    console.log(data);
  } catch (error) {
    console.error(error);
  }
});

asyncFunc();

```