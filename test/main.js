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