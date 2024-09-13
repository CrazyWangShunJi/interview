import module from './ESM1.js'

console.log(`原始模块原始值: ${module.count}`) // 1
console.log(`原始模块引用值: ${module.obj.name}`) // xxx

// 改变原始值
module.count = 10
// 改变引用值
module.obj.name = 'changed'

console.log(`当前模块的count: ${module.count}`) // 10
// 原始模块的count
module.showCount() // 1

console.log(`当前模块的name: ${module.obj.name}`) // change
// 原始模块的name
module.showName() // change原始模块原始值: 1

/* 
原始模块原始值: 1
原始模块引用值: xxx
当前模块的count: 10
原始模块count 1
当前模块的name: changed
原始模块name changed
 */