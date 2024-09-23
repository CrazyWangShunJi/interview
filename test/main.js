// 函数式编程
const _array = ['progressive$%coding', 'objective$%coding', 'functional$%coding']

// 函数 upperStr 字符串转化为首字母大写
const upperStr = (str) => str[0].toUpperCase() + str.slice(1)

// 先将字符串拆分成数组
// 再遍历数组，将数组中的字符串首字符大写
// 再组装数组成字符串
const reformatName = (str) => str.split('$%').map(item => upperStr(item)).join(' ')

// 将字符串转化为对象
const assembleObj = (key, value) => {
  let obj = {}
  obj[key] = value
  return obj
}

// 组合函数，实现功能
// 先遍历数组，调用reformatName将数组中的字符串转化为首字母大写
// 再调用assembleObj将字符串转化为对象
const paserArr = (arr) => arr.map((item) => assembleObj('name', reformatName(item)))
