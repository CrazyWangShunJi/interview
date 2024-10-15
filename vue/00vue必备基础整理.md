# 1、v-if 和 v-show的区别
* v-if 和 v-show都是控制元素的显示与隐藏，但是它们的实现方式不同。
<br></br>

* v-if 是通过动态地添加或移除 DOM 元素来实现的，当条件为 false 时，对应的 DOM 元素会被移除，而当条件为 true 时，对应的 DOM 元素会被添加到 DOM 树中。
* v-show 是通过设置元素的 display 属性来实现的，当条件为 false 时，对应的 DOM 元素的 display 属性会被设置为 none，而当条件为 true 时，对应的 DOM 元素的 display 属性恢复为默认值
<br></br>

* v-show: 适合频繁切换时使用，这样可以避免频繁地创建和销毁 DOM 元素。
* v-if: 
* * 在初次渲染时如果条件为 false，元素不会渲染到 DOM 中。这个时候适合使用v-if


<hr>**********************************************************<hr>


# 2、vue中的historty和hash模式区别
* 首选需要说明MPA和SPA
## MAP 和 SPA
* MPA多页面应用：用户每次导航到新的页面都会像服务器请求新的HTML页面，然后浏览器会重新加载整个页面
* SPA单页面应用：页面只会被加载一次，之后的页面更新和内容切切换都是通过JavaScript和AJAX来实现的
* SPA来使用前端路由来在页面之间进行切换

## hash模式
* URL 中以“#”符号后面的部分被称为哈希值（hash）。
* 当hash模式发生改变时，**浏览器不会像服务区发起请求的**
* 而是直接触发 hashChange事件
* **vue通过监听这个hashChange事件，就可以实现页面的切换，而无需加载整个页面**
```html
<!DOCTYPE html>
<html>

<body>
  <a href="#secion1">go section1</a>
  <a href="#secion1">go section1</a>

  <script>
    window.addEventListener('hashchange', () => {
      console.log('hashchange')
      // 实现页面切换
    })
  </script>
</body>
```

## history模式
* **history模式是利用了 history.pushState() 和 history.replaceState() 方法来实现的**
* 当使用这两个方法时，浏览器会在不重新加载页面的情况下直接修改浏览器的历史记录，并且改变url
```html
<body>
  <div id="A">A</div>
  <div id="B">B</div>
  <script>
    const itemA = document.getElementById('A');
    const itemB = document.getElementById('B');

    itemA.addEventListener('click', function() {
      history.pushState({}, null, '/A')
    })
    itemB.addEventListener('click', function() {
      history.pushState({}, null, '/B')
    })
  </script>
</body>
```

* 使用这一方式URL就不会带有#
* 需要说明的是，尽管history模式可以实现不刷新页面，就可以实现页面的切换
* **但是history模式中的url是不带#的，也就是说在用户再次刷线页面是，浏览器就会直接将这个url发送给后端，如果后端没有匹配当前url，就会出现404页面报错**
* 这也是为什么有时候把路由的方式从hash模式切换到history莫模式会直接白屏