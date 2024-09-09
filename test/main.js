function _new(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('error')
  }
  let target = {}

  const args = Array.prototype.slice.call(arguments, 1)

  // 修改原型链
  target.__proto__ = fn.prototype
  // 重新绑定this
  fn.call(target, args)

  return target
}