# bom
## 1 基本概念：
* bom: browser object model 浏览器对象模型， 是用于与浏览器窗口进行交互的一组API，它提供了对浏览器窗口对象（window）的访问，并通过 window 对象允许开发者操作浏览器窗口、控制浏览器显示的内容、与用户交互等。BOM 主要关注浏览器环境，而非页面内容本身。
<br></br>

* bom主要对象：
* window
* location
* history
* navigator
* screen

## 2 window
* window对象是BOM的顶层对象，它代表浏览器窗口。在浏览器中，window对象是全局对象，它可以直接访问全局变量和函数。
* 所有其他BOM对象如location、history、navigator和screen等都是window对象的属性或方法。
<br></br>

* 常用的方法有：
```js
// 弹出警告框
window.alert('This is an alert box!');

// 打开一个新窗口
window.open('https://www.example.com', '_blank');

// 设置计时器，1秒后执行
let timerId = window.setTimeout(() => {
  alert('1 second has passed!');
}, 1000);

// 清除计时器
window.clearTimeout(timerId);
```

####  window.open()
* 一般使用window.open()方法来打开一个新窗口。
* 但是该方法该方法有以下几点缺点

* 1、 安全性问题
* 当我们使用window.open()打开一个新窗口时，或者直接使用\<a>标签打开一个窗口时
```js
window.open('URL_ADDRESS', "_blank");

<a href="URL_ADDRESS" target="_blank">open</a>
```
* 在新的窗口中我们是可以直接通过window.opener来访问原来的那个窗口的引用的
* 即在window A中打开了window B，那么在window B中我们可以通过window.opener来访问window A的引用。
* 这样就有可能暴露在一些钓鱼网站的漏洞中
<br>

* 通常的解决办法是直接重置opener属性
* 在html中是酱rel设置为noopener
* 在js中是将window.opner设置为null
```js
// js
const win = window.open('URL_ADDRESS', "_blank");
win.opener = null;

// html
<a href="URL_ADDRESS" target="_blank" rel="noopener">open</a>
```


* 2、兼容性问题
* 1：**非用户行为导致的打开新窗口可能会被部分浏览器给拦截**
* 2：**在异步回调中执行的window.open()方法可能会被浏览器拦截**
* 针对1可尝试在dom中添加一个标签，然后触发点击事件，最后再将标签删除
```js
let a = document.createElement('a')
a.id = 'xxx'
document.body.appendChild(a)
a.addEventListener('click', function() {
  window.open(url)
})
a.click()
document.body.removeChild(a)
```


## 3 location
* location.href => "https://www.baidu.com/search?class=xxx#comments"
* .origin => "hrrps://www.baidu.com"
* .protocol => "https:"
* .host => "www.baidu.com"
* .post  获取端口号
* .pathname => "/search"
* .search => "?class=xxx"
* .hash => "#comments"
<br></br>

* location.assign('url')  => 替换path，再定向到指定path
* .replace('url') => 效果同上，但是不会记录历史记录（记录先出栈，再入栈，一般用这个方法和谐的进行重定向）
* .reload() => 重新加载当前页面
* .toString() => 将location转化为字符串

## 4、history
#### 4.1 一些基本属性和方法
* history.pushState(state, title, url) => 往历史记录堆栈顶部添加一条记录
* .replaceState(state, title, url) => 更改当前的历史记录
* .go()
<br></br>

* .length：返回历史记录中的条目数量。
* .state: 当使用history.pushState()或history.replaceState()方法修改历史记录时，可以传递一个状态对象作为参数。这个状态对象可以在后续的操作中通过history.state来获取。
```js
const stateObj = { page: 1 };
history.pushState(stateObj, '', '/page1');
console.log(history.state); // 输出 { page: 1 }
```

#### 4.2 路由中的history模式和hash模式的区别
#### hash模式
* URL 中以“#”符号后面的部分被称为哈希值（hash）。
* 当 URL 中的哈希值发生变化时，浏览器不会向服务器发送请求，而是会触发hashchange事件。
* 下面是一个监听hashchange的例子(当hash值改变时，控制台输出不同的值)
```html
<!DOCTYPE html>
<html>

<body>
  <a href="#section1">Go to Section 1</a>
  <a href="#section2">Go to Section 2</a>

  <script>
    window.addEventListener('hashchange', function () {
      const hash = window.location.hash;
      if (hash === '#section1') {
        console.log('Showing Section 1');
      } else if (hash === '#section2') {
        console.log('Showing Section 2');
      }
    });
  </script>
</body>

</html>
```

* **前端框架通过监听这个hashchange事件，就可以实现页面的切换，而无需重新加载整个页面**

#### history模式
* history模式是通过使用HTML5的history API来实现的。
* **通过history.pushState()和history.replaceState()方法可以修改浏览器的历史记录，而不会引起页面刷新**。
* 通过这两个方法就可以实现改变url，不需要刷新页面，就实现页面的切换
* 下面是例子，可以看出，当点击a标签时，url会改变，但是页面不会刷新
```js
<a href="javascript:toA();">A页面</a>
<a href="javascript:toB();">B页面</a>
<div id="app"></div>
<script>
  function render() {
    app.innerHTML = window.location.pathname
  }
  function toA() {
    history.pushState({}, null, '/a')
    render()
  }
  function toB() {
    history.pushState({}, null, '/b')
    render()
  }
  window.addEventListener('popstate', render)
</script>
```

* 上面的代码中监听了popstate事件，，该事件能监听到
* * 用户点击浏览器的前进和后退操作
* * 手动调用 history 的 back、forward 和 go 方法
* 监听不到：history 的 pushState 和 replaceState方法
* 这也是为什么上面的 toA 和 toB 函数内部需要手动调用 render 方法的原因
<br></br>

* 需要说明的是：
* 尽管使用history模式可以实现不用刷新页面，就可以实现页面切换，
* **但是history模式中的url是不带#的，也就是说在用户再次刷新页面时，浏览器会将这个url发给后端，如果后端没有匹配当前的url，就会出现404页面**
> 这也是为什么有时候把路由的方式从hash切换到history会出现白屏的现象


## 5、navigator
* 最常用用到的就是userAgent，返回浏览器的用户代理字符串，它包含了关于浏览器类型、版本、操作系统等信息。
* 这个通常在做浏览器兼容性判断的时候会用到
```js
if (navigator.userAgent.indexOf("Firefox") > -1) {
  // 针对 Firefox 浏览器的处理
} else if (navigator.userAgent.indexOf("Chrome") > -1) {
  // 针对 Chrome 浏览器的处理
}
```

## 6、screen
* Screen 接口表示一个屏幕窗口，往往指的是当前正在被渲染的 window 对象，可以使用 window.screen 获取它。
* 下面是几个不同的判断区域大小的参数

#### window.innerWidth | window.innerHeight
* window.innerWidth 返回以像素为单位的窗口的内部宽度。**如果垂直滚动条存在，则这个属性将包括它的宽度**
* 更确切的来说，innerWidth返回窗口的布局视口(layout viewport)的宽度
<br></br>

> 布局视口(layout viewport)是浏览器绘制网页的视口，本质上代表了可见的区域
<br></br>

> 可视视口（visual viewport）代表用户显示设备上当前可见的部分。。

#### element.clientWidth | element.clientHeight
* 上述说到，**window.innerWidth可获取包括浏览器滚动条宽度的窗口的宽度**
* **如果想获取不包含浏览器滚动条宽度的窗口的宽度，可使用根元素的clientWidth属性，即document.documentElement.clientWidth**
<br></br>

* 对于元素的clientWidth，表示元素内容的宽度 + padding（不包含 border、滚动条、margin）
* clientWidth = width + padding
* clientHeight同理

#### element.offsetWidth | element.offsetHeight
* 对于元素的offsetWidth，表示元素内容的宽度 + padding + border + 竖直方向上的滚动条
* offsetWidth = width + padding + border + scrollbar

#### offsetLeft | left 
* offsetLeft: 是一个元素的属性，表示该元素相对于其 offsetParent（离它最近的、具有定位属性的父级元素）的左侧偏移量，以像素为单位。它是**只读属性**，由浏览器根据元素在文档中的布局计算得出。
<br></br>

* left：通常在使用 CSS 定位属性（如 position: absolute 或 position: relative）时设置或获取元素的左偏移量。它是通过 CSS 样式设置的属性值，可以通过 JavaScript 中的 style.left 来访问和修改。
<br></br>

* 下面是一个关于left的例子：设计一个吸附在浏览器顶部的示例
```html
<!DOCTYPE html>
<html>

<head>
  <style>
   .container {
      padding: 0px;
      margin: 0px;
      height: 2000px;
      background-color: lightgray;
    }

   .sticky-element {
      position: fixed;
      top: 0;
      width: 100%;
      background-color: blue;
      color: white;
      padding: 10px;
      transition: top 0.3s ease-in-out;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="sticky-element">这是一个会吸在顶部的元素</div>
    <!-- 这里可以添加更多内容 -->
  </div>

  <script>
    const stickyElement = document.querySelector('.sticky-element');
    window.addEventListener('scroll', function () {
      if (window.scrollY > 0) {
        stickyElement.style.top = '0';
      } else {
        stickyElement.style.top = '-50px'; // 或者其他初始隐藏的位置
      }
    });
  </script>
</body>

</html>
```