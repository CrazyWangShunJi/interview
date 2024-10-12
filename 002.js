let affectiveEffect = undefined

const targetMap = new WeakMap()

function trigger(target, key) {
  if (!affectiveEffect) return
  
  const depsMap = targetMap.get(target)
  if(!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  const dep = depsMap.get(key)
  if(!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(affectiveEffect)
}