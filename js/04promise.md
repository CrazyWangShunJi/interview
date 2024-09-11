* 说起promise，它的出现让js更以更清晰和优雅的方式来处理回调地狱
* 所以我先从回调地狱说起

# 1 回调地狱
* 回调地狱是指在js中，需要顺序执行多个异步操作，并且每一个异步操作都依赖于上一个异步操作的完成，这样一来，回调函数就会逐层嵌套
* 嵌套一多，就形成了回调地狱

* 下面有个例子：
* 假设我们有一系列的一部异步任务需要来顺序执行，任务1完成后执行任务2，任务2完成后执行任务3，以此类推
* 使用setTimeout模拟异步任务
```js
function task1(callback) {
  setTimeout(() => {
    console.log('完成了任务1');
    callback();
  })
}

function task2(callback) {
  setTimeout(() => {
    console.log('完成了任务2');
    callback();
  })
}

function task3(callback) {
  setTimeout(() => {
    console.log('完成了任务3');
    callback();
  })
}

function task4(callback) {
  setTimeout(() => {
    console.log('完成了任务4');
    callback();
  })
}

// 回调地狱的形成
task1(() => {
  task2(() => {
    task3(() => {
      task4(() => {
        console.log('所有任务都完成了');
      })
    })
  })
})
```

* 对于上述的回调地狱，可以使用promise 或者 async/await 来解决（后续会有专门介绍async/await的章节）
* 著名：其实async/await 是promise的语法糖


# 2、Promise
* promise简单来说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果 
* 其一共有三种状态
* pending 待定 是最初始的状态，异步操作尚未完成，Promise哈没有返回结果
* fulfilled 已成功 异步操作成功完成，Promise返回一个成功的结果
* rejected 已失败 异步操作失败，Promise返回一个失败的结果
* 一旦状态发生改变，就不会再变了

## 2.1 Promise构造函数基本用法
* Promise构造函数，用于创建一个Promise实例，其接受一个回调函数作为参数，该回调函数又接受两个参数 resolve reject
* resolve 调用它表示异步操作成功，并返回异步操作的结果
* reject 调用它表示失败，并返回错误原因
* 另外需要说明的是Promise构造函数里面接受的回调函数，是同步执行的，是一个立即执行函数
```js
const myPromise = new Promise((resolve, reject) => {
  let flag = pending;
  /* 
    执行一些异步操作
    异步操作成功 将flag 的值改为success
    异步操作失败 将flag 的值改为fail
  */
 if (flag === 'success') {
  resolve('成功');
 } else if (flag === 'fail') {
  reject('失败');
 }
});
```

## 2.2 Promise.prototype.then
* 当Promise的状态发生改变时（状态变为成功或者失败），可以使用then方法会Promise实例添加回调函数。
* 其接收两个参数，onFulfilled回调函数 和 onRejected回调函数
* onFulfilled 是Promise对象的状态变为成功时所执行的异步函数，其参数是Promise实例resolve的值
* onRejected 是Promise对象的状态变为失败时所执行的异步函数，其参数是是Promise实例reject的值

* then()方法总是会返回一个新的Promise，这个Promise的状态和结果会根据回调函数的返回值来确定
* 如果then()的回调中返回了一个普通值，那么返回的是一个新的状态为fulfilled的Promise实例，且该值就是Promise实例的resolve值
* 如果then()的回调中抛出了一个错误，那么就会返回一个状态为rejected的Promise实例，并且错误信息就是Promise实例的reject值
* 如果then()返回了一个新的Promise实例，新的 Promise 的状态会由这个返回的 Promise 决定，也就是说，返回的 Promise 会“等待”这个新 Promise 完成。

* 现在还是上述回调地狱的例子，我们使用Promise来解决回调地狱
```js
function tasks1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('done task1')
      resolve()
    }, 1000)
  })
}

function tasks2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('done task2')
      resolve()
    }, 1000)
  })
}

function tasks3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('done task3')
      resolve()
    }, 1000)
  })
}

function tasks4() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('done task4')
      resolve()
    }, 1000)
  })
}

tasks1()
  .then(tasks2)
  .then(tasks3)
  .then(tasks4)
/* 
done task1
done task2
done task3
done task4 
*/
```

## 2.3 Promise.prototype.catch 和 Promise.prototype.finally
* Promise.prototype.catch()方法是.then(null, onRejected)或.then(undefined, onRejected)的别名，用于指定发生错误时的回调函数。
* finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作

## 2.4 Promise的静态方法
### Promise.all()
* Promise.all()接受一个 Promise 可迭代对象（例如数组）作为输入，并返回一个 Promise
* 当所有输入的 Promise 都被兑现（状态为fulfilled）时，返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），并返回一个包含所有兑现值(即resolve值)的数组。
* 如果输入的任何 Promise 被拒绝（状态为rejected），则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因(即reject值)。
```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 5000, '慢')
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, '快')
})

Promise.all([p1,p2])
 .then((values) => {
  console.log(values) // ['慢', '快']
 })
```

### Promise.race()
* 同样是接受一个 promise 可迭代对象作为输入，并返回一个 Promise。
* 这个返回的 promise 会随着第一个 promise 的敲定而敲定。
```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 5000, '慢')
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, '快')
})

Promise.race([p1,p2])
 .then((value) => {
  console.log(value) // 快
 })
```

### Promise.allSettled()
* 有时候我们希望等到每一组异步操作都结束，不管是每一个操作是成功还是失败，再进行下一步操作
* Promise.all()方法只适合所有异步操作都成功的情况，如果有一个操作失败，就无法满足要求。
* 这时候可以使用Promise.allSettled()

* 同样是接受一个 promise 可迭代对象作为输入，并返回一个 Promise。
* 当所有输入的 Promise 的状态都已敲定时（包括传入空的可迭代对象时），返回的 Promise 将被兑现(即状态为fulfilled)，并带有描述每个 Promise 结果的对象数组。
```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 5000, '慢')
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, '快')
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(reject, 2000, '失败')
})


Promise.allSettled([p1,p2,p3])
 .then((values) => {
  console.log(values)
 })

  
 /*
  * 输出结果：
  * [
  *   { status: 'fulfilled', value: '慢' },
  *   { status: 'fulfilled', value: '快' },
  *   { status:'rejected', reason: '失败' }
  * ]
  */
```

### Promise.any()
* 同样是接受一个 promise 可迭代对象作为输入，并返回一个 Promise。
* 只要有一个输入的Promise的状态变为fulfilled，返回的Promise实例就会变为fulfilled，并且返回第一个兑现的值
* 只有所有的Promise的状态全部变为rejected，返回的Promise实例的状态才会变为rejected，并且返回一个包含拒绝原因数组的 AggregateError 拒绝。

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(reject, 2000, '慢的失败')
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(reject, 1000, '快的失败')
})



Promise.any([p1,p2])
 .then(() => {},(reasons) => {
  console.log(reasons)
 })

/*  
[AggregateError: All promises were rejected] {
  [errors]: [ '慢的失败', '快的失败' ]
} 
*/
```

### Promise.resolve() 
* 有时需要将现有对象转为 Promise 对象，Promise.resolve()方法就起到这个作用。
* Promise.resolve()方法的参数分成四种情况：

* 1、 参数是一个 Promise 实例
* 如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。

* 2、参数是一个thenable对象
* Promise.resolve()方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then()方法。

* 3、参数不是具有then()方法的对象，或根本就不是对象
* 如果参数是一个原始值，或者是一个不具有then()方法的对象，则Promise.resolve()方法返回一个新的 Promise 对象，状态为resolved。

* 4、不带有任何参数
* Promise.resolve()方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。

### Promise.reject()
* Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。
* Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。
* 等同于：
```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))
```

# 3、手写Promise
```js
function exeCallbackResult(promise, result, resolve, reject) {
  // 首先需要判断 then方法返回的Promise对象是否是自己的Promise对象，如果是就会发生循环调用的问题
  if (promise === result) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  if (result instanceof MyPromise) {
    // 判断回调函数返回的值是否是Promise实例对象
    // 如果是实例对象，则then方法返回的Promise对像的状态和值都与该回调函数返回的Promise对象的状态和值都相同
    result.then((value) => resolve(value), (reason) => reject(reason))
  } else {
    // 如果是普通值
    // 则直接返回一个状态为成功的Promise对象，且该对象的值就是这个普通值
    resolve(value)
  }
}
class MyPromise {
  constructor(executor) {
    this.status = 'pending' // 初始化状态
    this.value = undefined // 初始化resolve值
    this.reason = undefined // 初始化reject值

    this.onFulfilledCallbacks = [] // 存放成功回调
    this.onRejectedCallbacks = [] // 存放失败回调

    // 定义resolve函数
    const resolve = (value) => {
      if(this.status === 'pending') {
        // 使用queueMicrotask将resolve函数放入微任务队列
        queueMicrotask(() => {
          // 改变状态
          this.status = 'fulfilled'
          // 给resolve赋值
          this.value = value
          // 执行回调

          if (this.onFulfilledCallbacks.length) {
            this.onFulfilledCallbacks.forEach(fn => fn(this.value))
            // 全部执行完后，清空下
            this.onFulfilledCallbacks = []
          }     
        })
      }
    }

    // 定义reject函数
    const reject = (reason) => {
      if (this.status === 'pending') {
        queueMicrotask(() => {
          this.status ='rejected'
          this.reason = reason

          if (this.onRejectedCallbacks.length) {
            this.onRejectedCallbacks.forEach(fn => fn(this.reason))
            this.onRejectedCallbacks = []

          }
        })
      }
    }

    // 执行executor函数
    try {
      executor(resolve, reject)
    } catch(err) {
      //  executor执行错误，状态变为rejected
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    // 如果onFulfilled和onRejected不是函数，就是用默认函数代替
    onFulfilled = typeof onFulfilled === 'function'? onFulfilled : value => value
    onRejected = typeof onRejected === 'function'? onRejected : reason => {throw reason}

    // 返回一个新的Promise
    const thenPromise = new MyPromise((resolve, reject) => {
      const resolveMicrotask = () => {
        // 创建一个微任务执行成功的回调函数
        queueMicrotask(() => {
          try {
            const result = onFulfilled(this.value)
            // then返回的Promise实例是由回调函数所返回的值，即result来决定的
            exeCallbackResult(thenPromise, result, resolve, reject)
          } catch(err) {
            reject(err)
          }
        })
      }

      const rejectMicrotask = () => {
        queueMicrotask(() => {
          try {
            const result = onRejected(this.reason)
            exeCallbackResult(thenPromise, result, resolve, reject)
          } catch(err) {
            reject(err)
          }
        })
      }
      if (this.status === 'fulfilled') {
        resolveMicrotask()
      } else if (this.status ==='rejected') {
        rejectMicrotask()
      } else {
        // pending状态
        // 因为此刻状态待定，所以需要将成功的回调函数和失败的回调函数存储起来
        // 等到Promise状态确定后再执行
        this.onFulfilledCallbacks.push(resolveMicrotask)
        this.onRejectedCallbacks.push(rejectMicrotask)
      }
    })

    return thenPromise
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }

  static resolve(value) {
    // 如果是Promise对象，则原封不动的返回
    if (value instanceof MyPromise) {
      return value
    }

    return new MyPromise((resolve, reject) => resolve(value))
  }
}
```