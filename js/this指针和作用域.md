# 1 作用域
## 1.1 执行环境
* 执行环境也称执行上下文，定义了变量和函数有权访问的数据。环境中的所有变量和函数都保存在一个变量对象中。当某个执行环境中的代码执行完毕之后，该执行环境被销毁，保存在其中的所有变量和函数也会随之销毁

* 全局执行环境是指最外围的环境，在web浏览器中，就是指window对象。

* 每个函数都有自己的执行环境，当函数执行完毕时，函数内的变量就会被销毁

## 1.2 变量提升
* 题1
```js
console.log(foo)
foo()
var foo = 10
console.log(foo)
function foo() {
  console.log('xxxx')
}
console.log(foo)
// function foo
// xxx
// 10
// 10
```

## 1.3 作用域连
* 在JavaScript中有作用域链的概念，作用域链其实就是执行环境的栈，在标识符解析的过程中，会沿着作用域链一层一层向上找。
* 程序在执行过程中，每进入一个新的执行环境就会将该执行环境压入执行环境栈中，每执行完毕跳出该执行环境，就会将执行环境弹出栈。
* 题2
```js
let a = 'global';
    
function course() {
    let b = 'zhaowa';

    session();
    // 函数提升
    function session() {
        let c = 'session';
        
        teacher(); 
        // 函数提升
        function teacher() {
            let d = 'yy';

            console.log(d); // yy
            // 作用域嵌套，作用域链向上找
            console.log('test1', b); // test1 zhaowa
        }
    }
}

course();

if (true) {
  let e = 111;
  var f = 222;
  console.log(e, f); // 111 222
}
console.log('f', f); // f 222
console.log('e', e); // err
```

# 2 闭包
* 闭包是指有权访问另一个函数作用域中的变量的函数, 创建闭包的常见形式是在一个函数内部创建并返回另一个函数。
* 比如
```js

```

* 题3 
```js
let arr = [] 
for (var i = 0; i < 5; i++) {
  arr[i] = function() {
    console.log(i)
  }
}
arr.forEach(i => i())


let arr = [] 
for (var i = 0; i < 5; i++) {
  (function(j) {
    arr[i] = function() {
      console.log(j)
    }
  })(i)
}
arr.forEach(i => i())
```