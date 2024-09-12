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