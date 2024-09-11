let a = 0
class A {
  constructor() {
    this.a = 1

  }
  x = () => {
    console.log(this.a)
  }
}

let out = new A()
out.x()