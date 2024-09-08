function People(num) { 
  let age = num;
  this.getAge = function() {
    return age;
  };
  this.addAge = function() {
    age++;
  };
}
let obj = new People(23); // new将this指向obj
console.log(obj.age); // undefined
// 属性age并不存在于对象obj中，但是由于闭包，属性age仍然被这个对象中的方法所引用，并不会被销毁
// 这就造成属性age始终存在，但是不能被直接访问和修改，必须调用方法，仿佛是obj私有的属性

console.log(obj.getAge()); // 23
obj.addAge()
console.log(obj.getAge()); // 24

let foo = new People(20);
console.log(foo.getAge()); // 20
