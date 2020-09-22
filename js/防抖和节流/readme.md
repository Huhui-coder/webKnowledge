在前端开发中会遇到一些频繁的事件触发，比如：

- `window` 的 `resize`、`scroll`
- `mousedown`、`mousemove`
- `keyup`、`keydown`
- ……

如果，我们在代码中对于这些容易频繁触发的函数加以限制，那么可能就会造成不必要的卡顿和性能浪费。

先来看个具体的场景

``` js
var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
    // 此时的this 是 container 这个DOM对象
    console.log(this)
    // 此时的e 是 MouseEvent 这个DOM对象
    console.log(e)
    container.innerHTML = count++;
    return container.innerHTML
};

container.onmousemove = getUserAction
```

从左边滑到右边就触发了 165 次 `getUserAction` 函数！

因为这个例子很简单，所以浏览器完全反应的过来，可是如果是复杂的回调函数或是 ajax 请求呢？假设 1 秒触发了 60 次，每个回调就必须在 1000 / 60 = 16.67ms 内完成，否则就会有卡顿出现。

解决方案

防抖和节流

什么是防抖：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!

什么是节流：如果你持续触发事件，每隔一段时间，只执行一次事件。