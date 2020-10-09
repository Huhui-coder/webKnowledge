# 1.简析vm.$nextTick和Vue.nextTick
## 作用
在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

如果你直接获取更新后的DOM数据，有可能还没有改变。
```js
  // 盗用官方的一个例子
  Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: '未更新'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = '已更新'
      console.log(this.$el.textContent) // => '未更新'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => '已更新'
      })
    }
  }
})
// 在 updateMessage 方法中，更新数据，立即获取更新后的 dom 是获取不到的，所以得把获取 dom 加到事件队列的栈，异步获取更新后的dom  
```
因为DOM更新是一个异步过程，是依据事件循环机制来执行的。所以立即获取更新后的 dom 是获取不到的。

## vm.$nextTick 和 Vue.nextTick的区别

Vue.nextTick内部函数的this指向window
```js
Vue.nextTick(function () {
    console.log(this); // window
})

```

vm.$nextTick内部函数的this指向Vue实例对象 一般都使用这个

```js
vm.$nextTick(function () {
    console.log(this); // vm实例
})

```

## 原理

跟事件循环机制有关

与之相关的异步函数MutationObserver，setImmediate还是setTimeout

nextTick的主要思路就是：我们有可能会在同步任务中多次改变DOM。那么在所有同步任务执行完毕之后，就说明数据修改已经结束了，改变DOM的函数我都执行过了，已经得到了最终要渲染的DOM数据，所以这个时候可放心更新DOM了。因此nextTick的回调函数都是在microtask中执行的。这样就可以尽量避免重复的修改渲染某个DOM元素，另一方面也能够将DOM操作聚集，减少渲染的次数，提升DOM渲染效率。等到所有的微任务都被执行完毕之后，就开始进行页面的渲染。


Vue最新的源码里面是用的`Promise.resolve().then(nextTickHandler)`

```js
export const nextTick = (function () {
  // callbacks存放所有的回调函数 也就是dom更新之后我们希望执行的回调函数
  var callbacks = []
  // pending可以理解为上锁 也可以理解为挂起 这里的意思是不上锁
  var pending = false
  // 使用哪种异步函数去执行：MutationObserver，setImmediate还是setTimeout
  var timerFunc
  // 会执行所有的回调函数 
  function nextTickHandler () {
    pending = false
    // 之所以要slice复制一份出来是因为有的cb执行过程中又会往callbacks中加入内容
    // 比如$nextTick的回调函数里又有$nextTick
    // 这些是应该放入到下一个轮次的nextTick去执行的，
    // 所以拷贝一份当前的，遍历执行完当前的即可，避免无休止的执行下去
    var copies = callbacks.slice(0)
    // 清空回调函数 因为全部都拿出来执行了
    callbacks = []
    // 执行所有的回调函数
    for (var i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
    
  // ios9.3以上的WebView的MutationObserver有bug，
  // 所以在hasMutationObserverBug中存放了是否是这种情况
  if (typeof MutationObserver !== 'undefined' && !hasMutationObserverBug) {
    // 随便声明一个变量作为文本的节点
    var counter = 1
    var textNode = document.createTextNode(counter)
    // 创建一个MutationObserver，observer监听到dom改动之后后执行回调nextTickHandler
    var observer = new MutationObserver(nextTickHandler)
    // 调用MutationObserver的接口，监测文本节点的字符改变
    observer.observe(textNode, {
      characterData: true
    })
    // 每次一执行timerFunc，就变化文本节点的字符，这样就会被observer监听到，然后执行nextTickHandler，nextTickHandler就会执行callback中的回调函数。
    timerFunc = function () {
      // 都会让文本节点的内容在0/1之间切换
      counter = (counter + 1) % 2
      // 切换之后将新值赋值到那个我们用observer观测的文本节点上去
      textNode.data = counter
    }
  } else {
    // webpack默认会在代码中插入setImmediate的垫片
    // 没有MutationObserver就优先用setImmediate，不行再用setTimeout
    // setImmediate是一个宏任务，但是他执行的速度比setTimeout快一点，只在IE下有，主要为了兼容IE。
    const context = inBrowser
      ? window
      : typeof global !== 'undefined' ? global : {}
    timerFunc = context.setImmediate || setTimeout
  }
  //这里返回的才是nextTick的内容
  return function (cb, ctx) {
    //有没有传入第二个参数
    var func = ctx
      //有的话就改变回调函数的this为第二个参数
      ? function () { cb.call(ctx) }
      //没有的话就直接把回调函数赋值给func
      : cb
    //把回调函数放到callbacks里面，等待dom更新之后执行
    callbacks.push(func)
    // 如果pending为true，就表明本轮事件循环中已经执行过timerFunc了
    if (pending) return
    // 上锁
    pending = true
    // 执行异步函数，在异步函数中执行所有的回调
    timerFunc(nextTickHandler, 0)
  }
})()
```
[参考文章](https://segmentfault.com/a/1190000008589736)

# 2.为什么别用index 作为v-for 循环时需要的key？
结合 diff 的过程进行讲解

先来讲讲使用index 作为key 会出现什么后果。

```js
<!-- 真正的虚拟DOM是js中的对象。 -->
<!-- newVDom -->
<ul>
    <li>b</li>  <!-- key==0 -->
    <li>c</li>  <!-- key==1 -->
    <li>d</li>  <!-- key==2 -->
    <li>e</li>  <!-- key==3 -->
</ul>
<!--  oldVDom -->
<ul>
    <li>a</li>  <!-- key==0 -->
    <li>b</li>  <!-- key==1 -->
    <li>c</li>  <!-- key==2 -->
    <li>d</li>  <!-- key==3 -->
    <li>e</li>  <!-- key==4 -->
</ul>

```
一个简单的列表数据，使用index 作为key 值，在删除的时候。

diff算法将newVDom与改变前的Dom结构(oldVDom)进行比较，我们找到key值相同的li标签，并进行自上至下逐一对比。对比发现:

newVDom	oldVDom	变化
key==0	key==0	文本改变
key==1	key==1	文本改变
key==2	key==2	文本改变
key==3	key==3	文本改变
无	key==4	删除节点

key 的不会变， 变的是节点中的属性，导致的结果就是会全部都会重新渲染，更新一遍。

为什么别使用随机数来作为key 值
```js
<item
  :key="Math.random()"
  v-for="(num, index) in nums"
  :num="num"
  :class="`item${num}`"
/>
```
每次列表更新后，key 值都完全变了，根据diff 算法，vue 会全部重新新建一个节点。

最佳实践：使用后端返回的唯一标识id 来作为key.
[参考文章](https://juejin.im/post/6844904113587634184#heading-14)
