let a = 1

if ( a === 2) {
  require(['./a'], a => {
    console.log(a)
  })
}