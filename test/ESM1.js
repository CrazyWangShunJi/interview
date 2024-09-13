let count = 1
let obj = {
  name: 'xxx'
}

function showCount() {
  console.log('原始模块count', count) 
}

function showName() {
  console.log('原始模块name', obj.name)
}
const module = {count, obj, showCount, showName}

export default module