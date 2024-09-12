const iifeModule = ((dependencyModule1, dependencyModule2) => {
  let count = 0

  const obj = {
    increase: () => ++count,
    reset: () => {
        count = 0
    }
  }
  // ...dependencyModule1.xxx, dependencyModule2.xxx
  return obj
})(dependencyModule1, dependencyModule2)