const myodule = (function() {
  const privateVar = 'this is private'
  return {
    getPrivateVar: function() {
      return privateVar
    }
  }
})()

console.log(module.getPrivateVar())