# 1 事件流
* 事件流（Event Flow）描述了浏览器在处理事件时，事件在页面元素间的传播顺序。主要有两种事件流模型：冒泡型事件流和捕获型事件流。

## 1. 1冒泡型事件流（Bubbling）
* 传播方向：从具体的目标元素（触发事件的元素）开始，向上传播到它的祖先元素。
<br></br>

* 举例：假如在一个 HTML 页面中有一个 <div> 元素，里面包含一个 <button> 元素。当用户点击这个按钮时，点击事件首先在 <button> 元素上触发，然后依次向上传播到 <div> 元素、<body> 元素、<html> 元素，最后到达 document 对象。
<br></br>

* 用途：可以利用冒泡机制在父元素上统一处理子元素的相同类型事件，避免为每个子元素单独绑定事件处理程序，提高代码的简洁性和可维护性。

## 1.2 捕获型事件流（Capturing）
* 传播方向：与冒泡型事件流相反，从最外层的祖先元素开始，向下传播到具体的目标元素。
<br></br>

* 举例：同样以上面的 HTML 结构为例，在捕获阶段，点击事件首先在 document 对象上触发，然后依次传播到 <html> 元素、<body> 元素、<div> 元素，最后到达 <button> 元素。、
<br></br>

* 用途：在某些情况下，需要在事件到达目标元素之前进行一些预处理操作，可以使用捕获阶段来实现。例如，可以在捕获阶段阻止某些事件继续向下传播到目标元素。

## 1.3、DOM 事件流
* 现代浏览器遵循的是 W3C 标准的 DOM 事件流，它结合了冒泡和捕获两个阶段：

* 事件捕获阶段：从最外层的祖先元素向目标元素传播。
* 处于目标阶段：在目标元素上触发事件。
* 事件冒泡阶段：从目标元素向祖先元素传播。
在 JavaScript 中，可以通过 addEventListener 方法的第三个参数来控制事件处理程序在捕获阶段还是冒泡阶段执行。如果第三个参数为 true，则事件处理程序在捕获阶段执行；如果为 false（默认值），则在冒泡阶段执行。

例如：

```html
<!DOCTYPE html>
<html>

<body>
  <div id="outer">
    <p id="inner">Click me</p>
  </div>
  <script>
    const outer = document.getElementById('outer');
    const inner = document.getElementById('inner');

    inner.addEventListener('click', function () {
      console.log('Clicked on inner element (bubbling)');
    }, false);

    outer.addEventListener('click', function () {
      console.log('Clicked on outer element (bubbling)');
    }, false);

    document.addEventListener('click', function () {
      console.log('Clicked on document (bubbling)');
    }, false);

    inner.addEventListener('click', function () {
      console.log('Clicked on inner element (capturing)');
    }, true);

    outer.addEventListener('click', function () {
      console.log('Clicked on outer element (capturing)');
    }, true);

    document.addEventListener('click', function () {
      console.log('Clicked on document (capturing)');
    }, true);
  </script>
</body>

</html>
```
在这个例子中，当点击 <p> 元素时，会分别在捕获阶段和冒泡阶段触发不同的事件处理程序，并输出相应的日志。

### 阻止事件传播
* 1、event.stopPropagation()
* 当一个事件发生后，它会从触发事件的最具体的元素（通常是用户点击的元素）开始向上冒泡，依次经过它的父元素、祖先元素等，直到到达文档的根元素。
* event.stopPropagation()方法可以在事件处理函数中调用，阻止事件继续向上冒泡传播。
```html
<!DOCTYPE html>
<html>

<body>
  <div id="parent">
    Parent
    <div id="child">
      Child
    </div>
  </div>

  <script>
    const parent = document.getElementById('parent');
    const child = document.getElementById('child');

    child.addEventListener('click', function (event) {
      console.log('Child clicked');
      event.stopPropagation();
    });

    parent.addEventListener('click', function () {
      console.log('Parent clicked');
    });
  </script>
</body>

</html>
```
* 在这个例子中，当点击子元素（child）时，会输出“Child clicked”，但由于调用了event.stopPropagation()，父元素的点击事件处理函数不会被触发。
<br>

* 2、在事件处理函数中返回 false
* 在一些情况下，在事件处理函数中返回false也可以阻止事件传播，并且还可以阻止事件的默认行为（例如链接的默认跳转行为）。
```html
<!DOCTYPE html>
<html>

<body>
  <a href="#" id="link">Click me</a>

  <script>
    const link = document.getElementById('link');
    link.addEventListener('click', function (event) {
      console.log('Link clicked');
      return false;
    });
  </script>
</body>

</html>
```
* 在这个例子中，点击链接时，会输出“Link clicked”，并且由于返回了false，链接的默认跳转行为被阻止，同时事件也不会向上冒泡传播到父元素。

### 阻止默认事件
* 1 event.preventDefault()
* 当一个事件发生时，浏览器通常会执行一些默认行为。例如，点击一个链接会导致页面导航到链接的目标地址，提交一个表单会导致页面刷新等。event.preventDefault()方法可以在事件处理函数中调用，阻止事件的默认行为。
```html
<!DOCTYPE html>
<html>

<body>
  <a href="https://www.example.com" id="link">Click me</a>

  <script>
    const link = document.getElementById('link');
    link.addEventListener('click', function (event) {
      console.log('Link clicked');
      event.preventDefault();
    });
  </script>
</body>

</html>
```

* 2 在事件处理函数中返回 false


### 事件代理
* 事件代理（Event Delegation）也被称为事件委托，是一种利用事件冒泡机制来优化事件处理的技术。
* 当一个元素上发生事件时，该事件会从最具体的元素（触发事件的元素）开始向上冒泡，经过它的父元素、祖先元素等，直到到达文档的根元素。事件代理就是利用这个冒泡机制，将事件处理程序添加到一个父元素上，而不是为每个子元素都添加事件处理程序。当子元素上发生事件时，事件会冒泡到父元素，然后在父元素上的事件处理程序中进行处理
```html
<!DOCTYPE html>
<html>

<body>
  <ul id="list">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>

  <script>
    const list = document.getElementById('list');
    list.addEventListener('click', function (event) {
      if (event.target.tagName === 'LI') {
        console.log('Clicked on item: ' + event.target.textContent);
      }
    });
  </script>
</body>

</html>
```