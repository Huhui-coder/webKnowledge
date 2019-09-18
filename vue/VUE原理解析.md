# 数据响应式实现

## 实现数据追踪变化

当你把一个普通的 JavaScript 对象传给 Vue 实例的 `data` 选项，Vue 将遍历此对象所有的属性，并使用 [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 把这些属性全部转为 getter/setter。Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器的原因。

```
Object.defineProperty(object, propertyname, descriptor)
将属性添加到对象，或修改现有属性的特性。
     //descriptor是描述符
     configurable ：可配置性
     enumerable ：可枚举性
     value ：设置属性的值
     writable ：仅当属性的值可以被赋值操作修改时设置为true。默认为false。
     get ：属性的getter方法，获取值时触发。
     set:属性的setter方法，设置值时触发。
function Archiver() {
  var temperature = null;
  var archive = [];

  Object.defineProperty(this, 'temperature', {
    get: function() {
      console.log('get!');
      return temperature;
    },
    set: function(value) {
      temperature = value;
      archive.push({ val: temperature });
    }
  });

  this.getArchive = function() { return archive; };
}
var arc = new Archiver();
arc.temperature; // 'get!'
arc.temperature = 11;
arc.temperature = 13;
arc.getArchive(); // [{ val: 11 }, { val: 13 }]
```

```
Vue在初始化数据的时候会遍历data代理这些数据 
function initData (vm) {
		    let data = vm.$options.data
		    vm._data = data
		    const keys = Object.keys(data)
		    let i = keys.length
		    while(i--) {
		        const key = keys[i]
		        proxy(vm,`_data`, key) 
		          }
		          observe(data)
		      }
		      function proxy (target, sourceKey, key) {
			    Object.defineProperty(target,key, {
			      enumerable: true,
			      configurable: true,
			      get() {
			        return
			        this[sourceKey][key]
			          }
			      set () {
			      	return 
			        this[sourceKey][key]= val
			      }
			    })
		}
```

这些 getter/setter 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化。这里需要注意的问题是浏览器控制台在打印数据对象时 getter/setter 的格式化并不同，所以你可能需要安装 [vue-devtools](https://github.com/vuejs/vue-devtools) 来获取更加友好的检查接口。

每个组件实例都有相应的 **watcher** 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 `setter` 被调用时，会通知 `watcher` 重新计算，从而致使它关联的组件得以更新。

```
使用vm.$watch 观测数据变化
const vm = new Vue({
			el:'#app',
			data:{
				msg:1
			}
		})
vm.$watch("msg",
 () => console.log("msg变了"));
vm.msg = 2; //输出「msg变了」
```

## 检测变化需要注意的事项

受现代 JavaScript 的限制 (以及废弃 `Object.observe`)，Vue **不能检测到对象属性的添加或删除**。由于 Vue 会在初始化实例时对属性执行 `getter/setter` 转化过程，所以属性必须在 `data` 对象上存在才能让 Vue 转换它，这样才能让它是响应的。例如： 

```
var vm = new Vue({
  data:{
  a:1
  }
})

// `vm.a` 是响应的

vm.b = 2
// `vm.b` 是非响应的
```

Vue 不允许在已经创建的实例上动态添加新的根级响应式属性 (root-level reactive property)。然而它可以使用 `Vue.set(object, key, value)` 方法将响应属性添加到嵌套的对象上： 	

```

```

## 声明响应式数据

由于 Vue 不允许动态添加根级响应式属性，所以你必须在初始化实例前声明根级响应式属性，哪怕只是一个空值： 

```
var vm = new Vue({
  data: {
    // 声明 message 为一个空值字符串
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// 之后设置 `message`
vm.message = 'Hello!'
```

如果你未在 data 选项中声明 `message`，Vue 将警告你渲染函数正在试图访问的属性不存在。

这样的限制在背后是有其技术原因的，它消除了在依赖项跟踪系统中的一类边界情况，也使 Vue 实例在类型检查系统的帮助下运行的更高效。而且在代码可维护性方面也有一点重要的考虑：`data` 对象就像组件状态的概要，提前声明所有的响应式属性，可以让组件代码在以后重新阅读或其他开发人员阅读时更易于被理解。

## 异步更新队列

可能你还没有注意到，Vue **异步**执行 DOM 更新。只要观察到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据改变。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作上非常重要。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部尝试对异步队列使用原生的 `Promise.then` 和 `MessageChannel`，如果执行环境不支持，会采用 `setTimeout(fn, 0)` 代替。

例如，当你设置 `vm.someData = 'new value'` ，该组件不会立即重新渲染。当刷新队列时，组件会在事件循环队列清空时的下一个“tick”更新。多数情况我们不需要关心这个过程，但是如果你想在 DOM 状态更新后做点什么，这就可能会有些棘手。虽然 Vue.js 通常鼓励开发人员沿着“数据驱动”的方式思考，避免直接接触 DOM，但是有时我们确实要这么做。为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 `Vue.nextTick(callback)` 。这样回调函数在 DOM 更新完成后就会调用。例如：

```
<div id="example">{{message}}</div>
```

```
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // 更改数据
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```

在组件内使用 `vm.$nextTick()` 实例方法特别方便，因为它不需要全局 `Vue` ，并且回调函数中的 `this` 将自动绑定到当前的 Vue 实例上： 

```
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: '没有更新'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = '更新完成'
      console.log(this.$el.textContent) // => '没有更新'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => '更新完成'
      })
    }
  }
})
```

## 订阅发布设计模式

订阅者订阅信息，然后发布者发布信息通知订阅者更新。

# 模板编译

![](C:\Users\Huhui\Desktop\笔记前端\模板编译.jpg)

complie 最终生成 render 函数，等待调用。这个方法分为三步： 

- parse 函数解析 template
- optimize 函数优化静态内容
- generate 函数创建 render 函数字符串

## parse 解析



在了解 parse 的过程之前，我们需要了解 AST，AST 的全称是 Abstract Syntax Tree，也就是所谓抽象语法树，用来表示代码的数据结构。在 Vue 中我把它理解为**嵌套的、携带标签名、属性和父子关系的 JS 对象，以树来表现 DOM 结构。** 下面是 Vue 里的 AST 的定义： 

![](C:\Users\Huhui\Desktop\笔记前端\parse.jpg)

我们可以看到 AST 有三种类型，并且通过 children 这个字段层层嵌套形成了树状的结构。而每一个 AST 节点存放的就是我们的 HTML 元素、插值表达式或文本内容。AST 正是 parse 函数生成和返回的。 parse 函数里定义了许多的正则表达式，通过对标签名开头、标签名结尾、属性字段、文本内容等等的递归匹配。把字符串类型的 template 转化成了树状结构的 AST。 

```
// parse 里定义的一些正则
export const onRE = /^@|^v-on:/ //匹配 v-on
export const dirRE = /^v-|^@|^:/ //匹配 v-on 和 v-bind
export const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/ //匹配 v-for 属性
export const forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/ //匹配 v-for 的多种形式
```

我们可以把这个过程理解为一个截取的过程，它把 template 字符串里的元素、属性和文本一个个地截取出来，其中的细节十分琐碎，涉及到各种不同情况（比如不同类型的 v-for，各种 vue 指令、空白节点以及父子关系等等），我们不再赘述。 

![](C:\Users\Huhui\Desktop\笔记前端\parse_1.jpg)



假设我们有一个元素`<div id="test">texttext</div>`，在 parse 完之后会变成如下的结构并返回：

 

```
  ele1 = {
    type: 1,
    tag: "div",
    attrsList: [{name: "id", value: "test"}],
    attrsMap: {id: "test"},
    parent: undefined,
    children: [{
        type: 3,
        text: 'texttext'
      }
    ],
    plain: true,
    attrs: [{name: "id", value: "'test'"}]
  }
```

## optimize 优化

在第二步中，会对 parse 生成的 AST 进行静态内容的优化。静态内容指的是**和数据没有关系，不需要每次都刷新的内容。**标记静态节点的作用是为了在后面做 Vnode 的 diff 时起作用，用来确认一个节点是否应该做 patch 还是直接跳过。optimize 的过程分为两步： 

- 标记所有的静态和非静态结点
- 标记静态根节点

### 标记所有的静态和非静态结点

```
function markStatic (node: ASTNode) {
  // 标记 static 属性
  node.static = isStatic(node)
  if (node.type === 1) {
    // 注意这个判断逻辑
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      markStatic(child)
      if (!child.static) {
        node.static = false
      }
    }
  }
}
```



- isStatic 函数

isStatic 函数顾名思义是判断该节点是否 static 的函数，符合如下内容的节点就会被认为是 static 的节点：

 

```
1. 如果是表达式AST节点，直接返回 false
2. 如果是文本AST节点，直接返回 true
3. 如果元素是元素节点，阶段有 v-pre 指令 ||
  1. 没有任何指令、数据绑定、事件绑定等 &&
  2. 没有 v-if 和 v-for &&
  3. 不是 slot 和 component &&
  4. 是 HTML 保留标签 &&
  5. 不是 template 标签的直接子元素并且没有包含在 for 循环中
  则返回 true
```

- if 判断条件

   

1. !isPlatformReservedTag(node.tag)：node.tag 不是 HTML 保留标签时返回true。
2. node.tag !== 'slot'：标签不是slot。
3. node.attrsMap['inline-template'] == null：node不是一个内联模板容器。

如果满足上面的所有条件，那么这个节点的 static 就会被置为 false 并且不递归子元素，当不满足上面某一个条件时，递归子元素判断子元素是否 static，只有所有元素都是 static 的时候，该元素才是 static。 

### 标记静态根节点

 这部分理解起来很简单，只有当一个节点是 static 并且其不能只拥有一个静态文本节点时才能被称为 static root。因为作者认为这种情况去做优化，其消耗会超过获得的收益。 

```
if (node.static && node.children.length && !(
  node.children.length === 1 &&
  node.children[0].type === 3
)) {
  node.staticRoot = true
  return
} else {
  node.staticRoot = false
}
```

## generate 生成 render

生成 render 的 generate 函数的输入也是 AST，它递归了 AST 树，为不同的 AST 节点创建了不同的内部调用方法，等待后面的调用。生成 render 函数的过程如下： 



![](C:\Users\Huhui\Desktop\笔记前端\render.jpg)

几种内部方法
_c：对应的是 createElement 方法，顾名思义，它的含义是创建一个元素(Vnode)
_v：创建一个文本结点。
_s：把一个值转换为字符串。（eg: {{data}}）
_m：渲染静态内容

`{render: "with(this){return _c('div',{attrs:{"id":"test"}},[[_v(_s(val))]),_v(" "),_m(0)])}"}`



整个 Vue 渲染过程，前面我们说了 complie 的过程，在做完 parse、optimize 和 generate 之后，我们得到了一个 render 函数字符串。 那么接下来 Vue 做的事情就是 new watcher，这个时候会对绑定的数据执行监听，render 函数就是数据监听的回调所调用的，其结果便是重新生成 vnode。当这个 render 函数字符串在第一次 mount、或者绑定的数据更新的时候，都会被调用，生成 Vnode。如果是数据的更新，那么 Vnode 会与数据改变之前的 Vnode 做 diff，对内容做改动之后，就会更新到我们真正的 DOM 上啦~ 

## render方式书写组件

```
<script type="text/javascript">
    Vue.component('child', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // tag name 标签名称
      this.$slots.default // 子组件中的阵列
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})

    new Vue({
    el:"#div1"
})
关于createElement方法，他是通过render函数的参数传递进来的，这个方法有三个参数: 
第一个参数主要用于提供dom的html内容，类型可以是字符串、对象或函数。比如”div”就是创建一个 <div>标签 
第二个参数（类型是对象）主要用于设置这个dom的一些样式、属性、传的组件的参数、绑定事件之类，具体可以参考 官方文档 里这一小节的说明 
第三个参数（类型是数组，数组元素类型是VNode）主要用于说是该结点下有其他节点的话，就放在这里。
```



# virtual dom原理

`DOM`是文档对象模型(`Document Object Model`)的简写，在浏览器中我们可以通过js来操作`DOM`，但是这样的操作性能很差，于是`Virtual Dom`应运而生。我的理解，`Virtual Dom`就是在js中模拟`DOM`对象树来优化`DOM`操作的一种技术或思路。 

`virtual-dom`(后文简称`vdom`)的概念大规模的推广还是得益于`react`出现，`virtual-dom`也是`react`这个框架的非常重要的特性之一。相比于频繁的手动去操作`dom`而带来性能问题，`vdom`很好的将`dom`做了一层映射关系，进而将在我们本需要直接进行`dom`的一系列操作，映射到了操作`vdom`，而`vdom`上定义了关于真实`dom`的一些关键的信息，`vdom`完全是用`js`去实现，和宿主浏览器没有任何联系，此外得益于`js`的执行速度，将原本需要在真实`dom`进行的`创建节点`,`删除节点`,`添加节点`等一系列复杂的`dom`操作全部放到`vdom`中进行，这样就通过操作`vdom`来提高直接操作的`dom`的效率和性能。 































































