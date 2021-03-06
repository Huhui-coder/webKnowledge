# 1、你对`this`有了解吗，有自己实现过`call`,`apply`和`bind`吗？
**它们的作用: 改变this的指向，可以将this 传为null 这个时候 this 指向的是window. 执行的函数也可以有返回值。**

**`call`,`apply` 二者之间的区别, 参数不同, call 只能一个一个传字符串， apply 能直接传一个数组**

**`bind` 与 `call`,`apply` 之间的区别， 后者调用了就直接执行函数了，前者是返回一个修改完this的`boundFunction`函数。**

## call()

>call()方法在使用一个指定的this值和若干个指定的参数值的前提下调用某个函数或方法。

```js
var foo = {
    value: 1
}

function bar () {
    console.log(this.value)
}
bar.call(foo) 
```

`bar.call(foo)` 两个关键点:1. call 改变了bar函数中的this指向, 指向到了foo.  2. bar 函数执行了

接下来看个例子
```js
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};

foo.bar(); // 1
```
像这种方式执行函数，是不是也间接实现了改变this指向的作用？

## call模拟实现1:

1. 将函数设置为对象的属性
2. 执行函数
3. 删除这个函数



```js
Function.prototype.call2 = function (context) {
    console.log(context) // 传进来的就是foo 这个对象
    context.fn = this // this 就是这个函数  因为调用的方式是 [函数].call(对象,...参数)
    context.fn()
    delete context.fn
}
var foo = {
    value: 1
}
var bar = function (){
    console.log(this.value)
}

bar.call2(foo)
```
但是存在一些问题, 不能获取指定的参数。
举个call 本身获取参数的例子
```js 
var foo = {
    value: 1
}
var bar = function (name, age){
    console.log(this.value, name, age) // 1 'hit' 23 
}

bar.call(foo, 'hit', 23)
```

首先思考下，在函数内怎样获取参数？
可以通过 `arguments` 对象获取
再想想，怎么将除了第一个的arguments参数放进方法中
可以通过循环获取

## call模拟实现2:

```js
// 第二版
Function.prototype.call2 = function (context) {
    context.fn = this
    var args = []
    for (var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments['+i+']')
    }
    eval('context.fn('+args+')'); // 自动调用Array.toString() 变成 context.fn('kevin', 18)
    // 如果用es6 直接 let args = [...arguments].slice(1); context.fn(...args)
    delete context.fn
}

var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call2(foo, 'kevin', 18); 
```
this 参数是可以传null的，当传null时,代表指向window. 函数也可以有返回值.

```js
var obj = {
    value: 1
}
var foo = function (name, age) {
    return {
        value: this.value,
        name,
        age
    }
}
var result = foo.call(obj, 'hit', 23)
console.log(result) 
```

## call模拟实现3:

```js
Function.prototype.call2 = function (context) {
    var context = context || window
    context.fn = this
    var args = []
    for (var i =1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args +')');
    delete context.fn
    return result
}
// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```
## apply 的实现

```js
Function.prototype.apply2 = function (context, arr) {
    var context = context || window
    context.fn = this
    var result,
        args = [];
    if (arr) {
        for (var i = 1, len = arguments.length; i < len; i++) {
            args.push('arguments[' + i + ']');
        }
        result = eval('context.fn(' + args + ')');
    } else {
        result = context.fn
    }
    delete context.fn
    return result
}

var bar = {
    value: 1
}
var foo = function (name, age) {
    return {
        value: this.value,
        name,
        age
    }
}
var result = foo.apply2(bar, 'hit', 23)
console.log(result)
//{value: 1, name: "hit", age: 23}
```
## bind()

bind 的作用

>方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。
bind() 的两个特点: 1. 返回一个函数, 2. 可以传入参数。

```js
var bar = {
    value: 1
}
var foo = function (name) {
    console.log(this.value, name)
}
var bindFun = foo.bind(bar, 'hit')
bindFun()
```

第一版代码先解决this指向问题

## Bind模拟实现1:

```js
Function.prototype.bind2 = function(context) {
    var self = this
    return function () {
        return self.apply(context) // 直接使用apply 来实现 this指向问题
    }
}
var bar = {
    value: 1
}
var foo = function () {
    console.log(this.value)
}
var bindFun = foo.bind2(bar)
bindFun()  // 1
```
再来看看bind 参数问题

```js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

var bindFoo = bar.bind(foo, 'daisy');
bindFoo('18');
// 1
// daisy
// 18
```
竟然可以在bind 的时候 传第一个参数， 在调用bind 返回的函数时 传入 第二个参数。
那我们就获取两次 arguments

## Bind模拟实现2:

```js
// 第二版
Function.prototype.bind2 = function (context) {

    var self = this;
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
        // 这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs));
    }
}
```
bind 最特殊的地方
>一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

也就是说当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。举个例子：
```js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value); 
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18'); // 由于是 bind 函数返回的函数作为构造函数, 其用bind()绑定的this 不生效了  而new 关键字 会改变函数this的指向, 此时的this 已经指向了 obj 这个对象
// undefined 
// daisy
// 18
console.log(obj.value);
console.log(obj.habit); // 可以获取到被模拟函数挂载到原型链上面的属性
console.log(obj.friend);
// shopping
// kevin
```

而我们要模拟实现bind 的这个特性, 难点在于 判断是否被当成了 构造函数 
如果是当成了构造函数 那么 可以通过 this instance of fBound 来判断

## Bind模拟实现3:

```js
// 第三版
Function.prototype.bind2 = function (context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
        return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype;
    return fBound;
}
```
我们直接将 fBound.prototype = this.prototype，我们直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype。这个时候，我们可以通过一个空函数来进行中转

万一调用bind 不是函数需要报错
最终版

## Bind模拟实现4:

```js
Function.prototype.bind2 = function (context) {

    var self = this;
    console.log(self) // bar ()
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        console.log(this) // fBound()
        console.log(this instanceof fNOP) // true
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}

var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value); // undefined
    console.log(name); // daisy
    // console.log(age); // 23
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind2(foo, 'daisy');
// bindFoo(23)
var obj = new bindFoo(23)
console.log(obj.friend) // kevin
```

# 2. 当使用 new 关键字时发生了什么?


# 3. 如何进行数据类型判断?
首先,讲明数据类型判断有哪几种方法,一共有四种,`typeof`、`instanceof`、`toString`和`contructor`。
四者之间的区别和应用场景。

## typeof

>它是一个运算符,运算过程中需要一个操作数,运算的结果就是这个操作数的类型，返回的是一个字符串
但是它具有一定的局限性，对于对象类型的值只能返回一个"object",却不能精确地它的类型。
特别地: 
```js
console.log(typeof undefined) // undefined
console.log(typeof object) // object
```
对于null 这个类型,返回的也是"object"，究其原因,JavaScript是用32位比特来存储值的，且是通过值的低1位或3位来识别类型的,Object 的低3位是0, 所以 typeof {} // 结果为object, 而 null 的值全是0， 所以typeof null // 结果也为 object.
另外 从 null 的常见用法来看, var obj = null, 表示 声明一个空对象,它的原始值为null。【期望此处将引用一个对象】

## instanceof

> 也是一个运算符，运算中需要两个操作数，运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
特别地:
```js
var str = 'str' // 使用字面量生成的
var str1 = new String('str') // 使用构造函数生成的
console.log(str instanceof String) // false
console.log(str1 instanceof String) // true
console.log(str instanceof Object) // false
console.log(str1 instanceof Object) // true
```
究其原因，是因为字面量生成的，没有挂载原型链这一操作，没有将实例对象的隐式原型链挂载到构造函数的原型链上。而 使用 new 关键字 生成的实例对象,是有这一步操作的。
```js
function objectFactory() {
    var obj = new Object(),
    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    Constructor.apply(obj, arguments);
    return obj;
};
```
## contructor

> constructor是对象的一个属性，不是运算符，constructor属性指向对象的构造函数。
举个例子：

```js
function User () {}
const u = new User()
console.log(u.constructor === User) // true
```
它的作用是跟 `typeof`、`instanceof`、`toString` 是有区别的，它主要是用来判断一个实例对象的构造函数是否为指定的构造函数。

## toString(最精准的数据类型判断)

>返回一个表示该对象的字符串，当对象表示为文本值或以期望的字符串方式被引用时，toString方法被自动调用。
返回的字符串是[object Function]形式。

```js
let a = {}
let b = [1, 2, 3]
let c = '123'
let d = function(){ console.log('fn') }

console.log(a.toString())   // '[object Object]'
console.log(b.toString())   // '1,2,3'
console.log(c.toString())   // '123'
console.log(d.toString())   // 'function(){ console.log('fn') }'
```

```js
toString.call(()=>{})       // [object Function]
toString.call({})           // [object Object]
toString.call([])           // [object Array]
toString.call('')           // [object String]
toString.call(22)           // [object Number]
toString.call(undefined)    // [object undefined]
toString.call(null)         // [object null]
toString.call(new Date)     // [object Date]
toString.call(Math)         // [object Math]
toString.call(window)       // [object Window]
```

# 4.前端的异步编程
首先搞懂，同步和异步的区别。
同步: 在等待上一件事情结束之后，再去做下一件事情。
异步：在上一件事情执行过程中,不等它结束，就去做下一件事情。
那么哪些操作会造成异步操作呢?
- setTimeout
- ajax
- promise
- generator
- async

setTimeout

```js
fn = function () {
    console.log(0)
    setTimeout(() => {
        console.log(1)
    }, 0)
}
fn()
```
以上代码会依次执行 0 , 1 
前端异步编程发展史: 回调函数=>Promise=>Generator=>async

## Callback()

第一个阶段回调函数,比如说一个ajax请求，下一个请求的参数依赖上一个请求的结果，那么就会形成回调函数的嵌套地狱.

## Promise

第二个阶段Promise,虽然它解决了回调函数的嵌套问题,但是仍然存在.then()函数的嵌套问题。可以使用Promise.all([])来解决，如果两个异步函数之间没有依赖关系。
Promise的存在的问题: 

- 错误被吃掉,Promise内部错误的代码并不会影响外部代码的执行
- 单一值,Promise 只能有一个完成值或一个拒绝原因，然而在真实使用的时候，往往需要传递多个值，一般做法都是构造一个对象或数组。然后使用es6的解构赋值去获取。
- 无法取消, Promise 一旦 新建就会立即执行,无法取消。
- 无法得知pending状态, 当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。
## Generator

第三个阶段Generator.

```js
function* fn2() {
    yield 'hello';
    yield 'world';
    return 'ending';
  }
var hw = fn2();
console.log(hw.next())
console.log(hw.next())
console.log(hw.next())
```
Generator 函数有多种理解角度。

语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

在函数形式上，函数名上会有* 号表示这是一个Generator函数，在函数体中，会有`yield` 表示暂停执行，并且将`yield`后面的表达式的值作为返回对象的value值。

在函数调用上,使用next()方法，调用函数使得指针移向下一个状态,也就是说，每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。返回的数据格式为 { value: 0, done: false }, value 表示本次状态的value, 由函数体内的 `yeild` 后面的表达式决定, done 表示 Generator函数是否执行完成。

换言之，Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。

Generator 函数并不会自动执行，也就是说，每一次执行，都必须要显式的调用next()方法。而使用Generator 自动执行库co,是可以做到自动执行的。
```js
var co = require('co');

function fetchData(url) {
    return function(cb) {
        setTimeout(function() {
            cb(null, { status: 200, data: url })
        }, 1000)
    }
}

function* gen() {
    var r1 = yield fetchData('https://api.github.com/users/github');
    var r2 = yield fetchData('https://api.github.com/users/github/followers');
    console.log([r1.data, r2.data].join('\n'));
}
co(gen);
```
以上代码会输出:
https://api.github.com/users/github
https://api.github.com/users/github/followers

## async

第四个阶段:async

async函数本质上是Generator 函数的语法糖。
举个例子:

```js
// 使用 generator
var fetch = require('node-fetch');
var co = require('co');

function* gen() {
    var r1 = yield fetch('https://api.github.com/users/github');
    var json1 = yield r1.json();
    console.log(json1.bio);
}

co(gen);
```
```js
// 使用 async
var fetch = require('node-fetch');

var fetchData = async function () {
    var r1 = await fetch('https://api.github.com/users/github');
    var json1 = await r1.json();
    console.log(json1.bio);
};

fetchData();
```
本质上,其实 async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。
```js
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```
spawn 函数指的是自动执行器，就比如说 co。

再加上 async 函数返回一个 Promise 对象，你也可以理解为 async 函数是基于 Promise 和 Generator 的一层封装。

相对于Promise， 使用async 函数的优势。
- 代码更加简洁
```js
/**
 * 示例一
 */
function fetch() {
  return (
    fetchData()
    .then(() => {
      return "done"
    });
  )
}

async function fetch() {
  await fetchData()
  return "done"
};
```
- 捕获错误
Promise是采用的在Promise的实例对象中使用reject 抛出错误，在 函数执行时使用.catch捕获错误。
async 是采用的 try - catch 捕获错误。
- 调试
使用promise 时，打断点时，代码是不会按书写顺序执行的，它会按照运行时的顺序执行。
使用async 时，打断点时，代码是会按书写顺序执行的.
换言之，就是用同步的方式来书写异步的代码。

async 函数可能会带来的问题
- async 地狱, 本来没有执行顺序上的依赖关系，但是开发者为了书写方便，使函数执行变得有依赖关系了，从而损失了性能。
```js
(async () => {
  const getList = await getList();
  const getAnotherList = await getAnotherList();
})();
```
以上代码，是必须得getList方法得到返回值了之后,后面的getAnotherList()才会执行，其实，他们完全可以异步执行。
解决方案
```js
(async () => {
  const listPromise = getList();
  const anotherListPromise = getAnotherList();
  await listPromise;
  await anotherListPromise;
})();
```
```js
(async () => {
  Promise.all([getList(), getAnotherList()]).then(...);
})();
```
另外两个应用点。
- 使用async 实现ajax 请求,继发
- 使用async 实现ajax 请求,并发
```js
// 继发一
async function loadData() {
  var res1 = await fetch(url1);
  var res2 = await fetch(url2);
  var res3 = await fetch(url3);
  return "whew all done";
}
// 继发二
async function loadData(urls) {
  for (const url of urls) {
    const response = await fetch(url);
    console.log(await response.text());
  }
}
```
```js
// 并发一
async function loadData() {
  var res = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
  return "whew all done";
}
```

# 5.前端的事件循环机制
分浏览器的事件循环和Node.js的事件循环

## 浏览器端的事件循环机制

首先来讨论 浏览器的事件循环机制

>javascript从诞生之日起就是一门单线程的非阻塞的脚本语言。这是由其最初的用途来决定的：与浏览器交互。
- 单线程
- 非阻塞

单线程意味着,javascript代码在执行的任何时候，都只有一个主线程来处理所有的任务。

非阻塞则是当代码需要进行一项异步任务（无法立刻返回结果，需要花一定时间才能返回的任务，如I/O事件）的时候，主线程会挂起（pending）这个任务，然后在异步任务返回结果的时候再根据一定规则去执行相应的回调。

那么非阻塞这个特性是如何来实现的呢?
答案就是依靠 event Loop (事件循环)机制。
事件循环机制由三部分组成

- 执行上下文
- 函数执行栈
- 事件执行队列

执行栈是同步代码执行时执行上下文存在的空间。事件队列是异步事件返回结果时按先后顺序排列所形成的。

大部分的函数执行顺序可以依靠函数调用栈的规则执行，即当一个脚本第一次执行的时候，js引擎会解析这段代码，并将其中的同步代码按照执行顺序加入执行栈中，然后从头开始执行。如果当前执行的是一个方法，那么js会向执行栈中添加这个方法的执行环境，然后进入这个执行环境继续执行其中的代码。当这个执行环境中的代码 执行完毕并返回结果后，js会退出这个执行环境并把这个执行环境销毁，回到上一个方法的执行环境。。这个过程反复进行，直到执行栈中的代码全部执行完毕。

而异步函数或者事件绑定中的代码执行顺序则是通过事件执行队列(任务队列)来决定的。
而任务队列又可以分为 宏任务 和 微任务
宏任务: script(整体代码), setTimeout/setInterval, I/O, UI rendering等。
微任务: Promise。

在一个事件循环中，异步事件返回结果后会被放到一个任务队列中。然而，根据这个异步事件的类型，这个事件实际上会被对应的宏任务队列或者微任务队列中去。并且在当前执行栈为空的时候，主线程会 查看微任务队列是否有事件存在。如果不存在，那么再去宏任务队列中取出一个事件并把对应的回到加入当前执行栈；如果存在，则会依次执行队列中事件对应的回调，直到微任务队列为空，然后去宏任务队列中取出最前面的一个事件，把对应的回调加入当前执行栈...如此反复，进入循环。

**我们只需记住当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一次事件循环中，微任务永远在宏任务之前执行。**

```js
setTimeout(() => {
    console.log('timeout1')
});

new Promise((resovle) => {
    console.log('promise1')
    for (var i = 0; i < 1000; i++) {
        i == 99 && resovle('resolve1')
    }
    console.log('promise2')
}).then((res) => {
    console.log('then1')
    console.log(res)
})
console.log('gloab1')
```
以上代码的执行顺序为 
promise1
promise2
gloab1
then1
resolve1
timeout1
首先执行宏任务中的script(整体代码),第一个遇到的是setTimeout 将其放入setTimeout宏任务队列中，然后又遇到了Promise实例,Promise构造函数中的第一个参数,是在new 创建时就立即执行的，因此不会进入任何其他的队列，先会输出'promise1'， 然后又遇到for 循环, 它也是不会进入其他的队列,立即执行resolve()函数, 再输出'promise2',再后面遇到.then()函数，将其放入Promise 微任务中, 继续向下执行，输出'gloab1'，至此全局任务(整体代码)执行完毕。
第一个宏任务 script执行完毕后，开始执行之前放入任务队列中的微任务，执行.then()输出 then1 和 resolve1, 至此微任务队列执行完毕，再开始执行之前放入任务队列中的宏任务，执行 setTimeout中的代码，输出 timeout1.
```js
setTimeout(function () {
    console.log(1);
});

new Promise(function (resolve, reject) {
    console.log(2)
    resolve(3)
}).then(function (val) {
    console.log(val);
})

console.log(0);
```
以上代码输出:
2 0 3 1 

# 6.前端实现动画的方式有哪几种?
分六种
- js
- css transition
- css animation
- svg (应用较少，暂不讨论)
- canvas
- requestAnimationFrame

## js 方式:

> 其主要思想是通过setInterval或setTimeout方法的回调函数来持续调用改变某个元素的CSS样式以达到元素样式变化的效果。

存在的问题: 实现动画通常会导致页面频繁性重排重绘，消耗性能，一般应该在桌面端浏览器。在移动端上使用会有明显的卡顿。

通常建议设置每个 setTimeout 的时间间隔为 16ms，一般认为人眼能辨识的流畅动画为每秒60帧，这里16ms比(1000ms/60)帧略小一些，但是一般可仍为该动画是流畅的。 

## css transition方式；

> transition是过度动画。但是transition并不能实现独立的动画，只能在某个标签元素样式或状态改变时进行平滑的动画效果过渡，而不是马上改变。
注意: 在移动端开发中，直接使用transition动画会让页面变慢甚至卡顿。所以我们通常添加transform:translate3D(0,0,0)或transform:translateZ(0)来开启移动端动画的GPU加速，让动画过程更加流畅。

## css animation方式：

> animation 算是真正意义上的CSS3动画。通过对关键帧和循环次数的控制，页面标签元素会根据设定好的样式改变进行平滑过渡。而且关键帧状态的控制是通过百分比来控制的。
注意: CSS3最大的优势是摆脱了js的控制，并且能利用硬件加速以及实现复杂动画效果。并且性能较好。

[CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) **animation** 属性是 [`animation-name`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-name)，[`animation-duration`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-duration), [`animation-timing-function`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function)，[`animation-delay`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-delay)，[`animation-iteration-count`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-iteration-count)，[`animation-direction`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-direction)，[`animation-fill-mode`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode) 和 [`animation-play-state`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-play-state) 属性的一个简写属性形式。

```
html
    <span class="box">我的家园</span>
css
.box {
      position: relative;
    }
    .box:hover::after {
      content: "";
      width: 100%;
      height: 3px;
      position: absolute;
      left: 0;
      bottom: -5px;
      background-color: black;
      animation: 0.8s linear slidein;
    }
    @keyframes slidein {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }
```

实现一个简单的鼠标hover 之后,底下的字体底边从中间慢慢延伸到两边的一个动画效果。

## canvas 方式

```js
window.onload = (() => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let left = 0;
    let timer = setInterval(function () {
        ctx.clearRect(0, 0, 700, 550);
        ctx.beginPath();
        ctx.fillStyle = "#ccc";
        ctx.fillRect(left, 0, 100, 100);
        ctx.stroke();
        if (left > 700) {
            clearInterval(timer);
        }
        left += 1;
    }, 16);
})
```
> 通过getContext()获取元素的绘制对象，通过clearRect不断清空画布并在新的位置上使用fillStyle绘制新矩形内容实现页面动画效果。
Canvas主要优势是可以应对页面中多个动画元素渲染较慢的情况，完全通过javascript来渲染控制动画的执行。可用于实现较复杂动画。

## requestAnimationFrame方式

> window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
requestAnimationFrame是另一种Web API，原理与setTimeout和setInterval类似，都是通过javascript持续循环的方法调用来触发动画动作。但是requestAnimationFrame是浏览器针对动画专门优化形成的APi，在性能上比另两者要好。

语法: 
>window.requestAnimationFrame(callback);
参数: callback 下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)。该回调函数会被传入DOMHighResTimeStamp参数，该参数与performance.now()的返回值相同，它表示requestAnimationFrame() 开始去执行回调函数的时刻。

返回值: 一个 long 整数，请求 ID ，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给 window.cancelAnimationFrame() 以取消回调函数。

```js
window.onload = (() => {
    const element = document.querySelector('#box');
    let start;
    function step(timestamp) {
        if (start === undefined)
            start = timestamp;
        const elapsed = timestamp - start;
        // `Math.min()` is used here to make sure that the element stops at exactly 200px.
        element.style.transform = 'translateX(' + Math.min(0.1 * elapsed, 2000) + 'px)';

        if (elapsed < 20000) { // Stop the animation after 2 seconds
            window.requestAnimationFrame(step);
        }
    }
    window.requestAnimationFrame(step);
})
```

# 7.讲讲闭包

从以下几个方面来讲闭包：
第一个闭包产生的原因:一个函数，返回了一个函数，并且这个返回的函数是用到了外部函数中的局部变量的,当外部函数被使用时，保持了内部函数的引用，所以就造成一个效果，在一个函数外部调用函数的局部变量。

第二个闭包的常见作用:模块化编程,避免污染全局作用域。

从词法作用域,开始聊起。
看一个 简单的 函数
```js
function init() {
    var name = "Mozilla"; // name 是一个被 init 创建的局部变量
    function displayName() { // displayName() 是内部函数，一个闭包
        alert(name); // 使用了父函数中声明的变量
    }
    displayName();
}
init();
```
因为一个内部函数是可以访问到外部函数的变量，所以 displayName() 可以使用父函数 init() 中声明的变量 name 。

再将这个问题深化以下
```js
function makeFunc() {
    var name = "Mozilla";
    function displayName() {
        alert(name);
    }
    return displayName;
}

var myFunc = makeFunc();
myFunc();
```

在一个函数中,返回一个函数,而返回的这个函数内部调用了外部函数声明的变量。这就构成了一个闭包。

在本例子中，myFunc 是执行 makeFunc 时创建的 displayName 函数实例的引用。displayName 的实例维持了一个对它的词法环境（变量 name 存在于其中）的引用。因此，当 myFunc 被调用时，变量 name 仍然可用，其值 Mozilla 就被传递到alert中。

如何实现add(2)(5) === 7?

```js
function add(x) {
    return function(y) {
      return x + y;
    };
  }
  
  var addFunc = add(5)(2);
  
  console.log(addFunc); // 7
```
这道题就是使用了闭包。

闭包的作用?

- 用闭包模拟私有方法(闭包是自有一个作用域的，使用闭包不会影响到全局作用域)
```js
var makeCounter = function() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }  
};

var Counter1 = makeCounter();
var Counter2 = makeCounter();
console.log(Counter1.value()); /* logs 0 */
Counter1.increment();
Counter1.increment();
console.log(Counter1.value()); /* logs 2 */
Counter1.decrement();
console.log(Counter1.value()); /* logs 1 */
console.log(Counter2.value()); /* logs 0 */
```
- 自执行函数(适用于模块化编程, 同样不会污染全局作用域)
```js
(()=>{
    Hit = {
        name: 'hit',
        age: 12
    }
    return window.Hit = Hit
})()

console.log(window.Hit)
```


性能考量

闭包在处理速度和内存消耗方面对脚本性能具有负面影响。

通常来说，函数的活动对象会随着执行期上下文一起销毁，但是，由于闭包引用另外一个函数的活动对象，因此这个活动对象无法被销毁，这意味着，闭包比一般的函数需要更多的内存消耗。

# 8.从输入url地址栏,发生了什么?由此来介绍如何性能优化。

[性能优化](https://juejin.im/post/6844903794279448590#heading-12)

首先讲讲输入url后，发生了哪些事情?
- 浏览器向 DNS 服务器请求解析该 URL 中的域名所对应的 IP 地址 [DNS解析]
- 建立TCP连接 [三次握手]
- 浏览器发出读取文件(URL中域名后面部分对应的文件)的 HTPP请求,该请求报文作为TCP三次握手的第三个报文的数据发送给服务器。 [浏览器发送读取文件内容的HTTP请求到服务器]
- 服务器对浏览器请求作出响应,并把对应的html文本发送给浏览器。 [服务器发送HTML数据至浏览器]
- 浏览器开始渲染 html 内容 [浏览器渲染HTML]
- 释放 TCP 链接 [四次挥手]

简单聊聊性能优化
- 在通信比较频繁的应用中, 使用websocket 代替 http 。因为 websocket 具备，一次TCP握手，就一直保持连接，而且对于二进制传输有着很好的支持性，可以应用于即时通信。还可以使服务端主动发消息到客户端，这是HTTP所不具备的。

- 配置懒加载, 图片懒加载, vue 路由懒加载。

- Nginx使用gzip 来进行HTPP的压缩

- 使用 requestAnimationFrame 来触发 js 动画。它能保证在 在每一帧的开始执行动画。而传统的js 动画执行方式是使用(setTimeout或者setInterval)，由于 js 执行机制的问题, 它是没办法保证在每一帧的最开始就执行动画的，如果不能保证在每一帧的最开始执行动画，那么即便我们保障每一帧的总耗时小于16ms，但是执行的时机如果在每一帧的中间或最后，最后的结果依然是没有办法每隔16ms让屏幕产生一次变化。还是会卡。

- 尽量使用 translateZ(0) 开启 硬件加速。这个问题是因为使用transform和opacity做CSS动画的时候，会将元素提升为一个复合层；而使用js操作css属性做动画时，必须使用translateZ或will-change才能将元素强行提升至一个复合层。

元素本身使用transform和opacity做CSS动画的时候，会提前告诉GPU动画如何开始和结束及所需要的指令；所以会创建一个复合层（渲染层），并把页面所有的复合层发送给GPU；作为图像缓存，然后动画的发生仅仅是复合层间相对移动。

而使用js做动画，js必须在动画的每一帧计算元素的状态；发送给GPU，但不会将元素提升至一个复合层；所以想让元素提升至一个复合层，必须使用translateZ或will-change: transform, opacity。

使用 translate3D 会让浏览器开启硬件加速，性能当然就提高了。translateZ变成3d效果，走GPU渲染。这样也有缺点就是耗电和发热问题。同样的canvas也会开启gpu渲染。

# 9. 讲讲浏览器缓存

- preload，prefetch 和 preconnect [preload](https://juejin.im/post/6844903646996480007)

它们带来的好处包括允许前端开发人员来优化资源的加载，减少往返路径并且在浏览页面时可以更快的加载到资源。

preload 预加载资源 设定资源加载的优先级为最高
```js
<link rel="preload" href="image.png">

<link rel="preload" href="https://example.com/fonts/font.woff" as="font" crossorigin>

<!-- Via markup -->
<link rel="preload" href="/css/mystyles.css" as="style">

```
   
prefetch 低优先级的资源加载提示

Prefetch 是一个低优先级的资源提示，允许浏览器在后台（空闲时）获取将来可能用得到的资源，并且将他们存储在浏览器的缓存中。

preconnect 在正式http请求前做一些操作

preconnect 允许浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析，TLS 协商，TCP 握手，这消除了往返延迟并为用户节省了时间。

- defer、async 

defer和async是script标签的两个属性，用于在不阻塞页面文档解析的前提下，控制脚本的下载和执行。 在介绍他们之前，我们有必要先了解一下页面的加载和渲染过程：

## 页面的加载和渲染过程

1. 浏览器通过HTTP协议请求服务器，获取HMTL文档并开始从上到下解析，构建DOM；
在构建DOM过程中，如果遇到外联的样式声明和脚本声明，则暂停文档解析，创建新的网络连接，并开始下载样式文件和脚本文件；
2. 样式文件下载完成后，构建CSSDOM；脚本文件下载完成后，解释并执行，然后继续解析文档构建DOM
完成文档解析后，将DOM和CSSDOM进行关联和映射，最后将视图渲染到浏览器窗口
3. 在这个过程中，脚本文件的下载和执行是与文档解析同步进行，也就是说，它会阻塞文档的解析，如果控制得不好，在用户体验上就会造成一定程度的影响
4. 完成文档解析后，将DOM和CSSDOM进行关联和映射，最后将视图渲染到浏览器窗口 在这个过程中，脚本文件的下载和执行是与文档解析同步进行，也就是说，它会阻塞文档的解析，如果控制得不好，在用户体验上就会造成一定程度的影响
## defer和async的原理
![defer和async原理](https://user-gold-cdn.xitu.io/2019/6/27/16b96e86f8fcfb58?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
1. defer 和 async 在网络读取（下载）这块儿是一样的，都是异步的（相较于 HTML 解析）
2. 它俩的差别在于脚本下载完之后何时执行，显然defer是最接近我们对于应用脚本加载和执行的要求的
3. async 则是一个乱序执行的主，反正对它来说脚本的加载和执行是紧紧挨着的，所以不管你声明的顺序如何，只要它加载完了就会立刻执行

所以相对于默认的script引用，这里配合defer和async就有两种新的用法，它们之间什么区别那？

1. 默认引用 script:<script type="text/javascript" src="x.min.js"></script>


当浏览器遇到 script 标签时，文档的解析将停止，并立即下载并执行脚本，脚本执行完毕后将继续解析文档。

2. async模式 <script type="text/javascript" src="x.min.js" async="async"></script>


当浏览器遇到 script 标签时，文档的解析不会停止，其他线程将下载脚本，脚本下载完成后开始执行脚本，脚本执行的过程中文档将停止解析，直到脚本执行完毕。

3. defer模式 <script type="text/javascript" src="x.min.js" defer="defer"></script>


当浏览器遇到 script 标签时，文档的解析不会停止，其他线程将下载脚本，待到文档解析完成，脚本才会执行。
>所以async和defer的最主要的区别就是async是异步下载并立即执行，然后文档继续解析，defer是异步加载后解析文档，然后再执行脚本，这样说起来是不是理解了一点了
## 关于defer我们需要注意下面几点：

defer只适用于外联脚本，如果script标签没有指定src属性，只是内联脚本，不要使用defer
如果有多个声明了defer的脚本，则会按顺序下载和执行
defer脚本会在DOMContentLoaded和load事件之前执行

## 关于async，也需要注意以下几点：

只适用于外联脚本，这一点和defer一致
如果有多个声明了async的脚本，其下载和执行也是异步的，不能确保彼此的先后顺序
async会在load事件之前执行，但并不能确保与DOMContentLoaded的执行先后顺序

- service-worker, PWA渐进式web应用 [PWA](https://lavas.baidu.com/pwa/README)

- localStorage、sessionStorage、cookie、session
从生命周期，存储大小，常见用途等几个方面来理解。
[前端存储](https://juejin.im/post/6844903945253421069)

# 10. 讲讲跨域, cookie 可以跨域吗? localStorage 可以跨域吗？
解决跨域的方法: `JSOP`、`CORS`、`postmessage`、`websocket`、Nginx 反向代理等等。

JSONP跨域原理：script 标签本身是不跨域的，利用script 请求api 接口，再使用?callback=JSONPCALLBACK的方式来获取返回的数据，其中，JSONPCALLBACK方法就是客户端获取返回数据的方法。
缺点是因为是依靠script来发请求，所以只支持get的请求来处理跨域。

CORS的跨域原理：服务器端添加一下代码：
```js
Access-Control-Allow-Origin: '*'
Access-Control-Allow-Methods: '*',
Access-Control-Expose-Headers: '*'
```

在本地开发时，通过是借助webpack 的 devServer来配置跨域。
```js
devServer: {
    proxy: {
      '/api': {
        target: 'http://10.12.6.24:30463',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
```
然后在axios 统一配置baseURL，那么以/api 开头的api 请求都会经过devServe 的代理，代理到 http://10.12.6.24:30463 服务器处。

线上运行时，通常是通过配置Nginx 写配置文件以达到反向代理的作用。

Nginx 反向代理配置。以代理服务器来接受Internet上的连接请求，然后将请求转发给内部网络上的服务器。
```js
 location /some/path/ {
    proxy_pass http://www.example.com/link/;
}
```
localStorage 不可以跨域, 可以自己封装一个可以设置过期时间的localStorage。

如何设计
```js
localstorage原生是不支持设置过期时间的，想要设置的话，就只能自己来封装一层逻辑来实现：
// 存的时候，将过期时间加进去，
// 取的时候，判断是否过期，过期就清除掉，没过期就返回它。

function set(key,value){
  var curtime = new Date().getTime();//获取当前时间
  localStorage.setItem(key,JSON.stringify({val:value,time:curtime}));//转换成json字符串序列
}
function get(key,exp)//exp是设置的过期时间
{
  var val = localStorage.getItem(key);//获取存储的元素
  var dataobj = JSON.parse(val);//解析出json对象
  if(new Date().getTime() - dataobj.time > exp)//如果当前时间-减去存储的元素在创建时候设置的时间 > 过期时间
  {
    console.log("expires");//提示过期
  }
  else{
    console.log("val="+dataobj.val);
  }
}


```

cookie，可以实现跨域传递。

跨域时响应头: Access-control-Allow-credentials: true.

【前端】在axios 中：

```js
// 在请求拦截器中，将config 配置项中的 withCredentials 设置为true.
axios.interceptors.request.use(config => {
  config.withCredentials = true;
  return config;
});
```
【后端】设置响应头：

```js
"Access-Control-Allow-Origin": Request Headers Origin
"Access-Control-Allow-Credentials": true
```

# 11.如何让`display`出现动画
问题描述：当一个元素最开始的属性为`display:none`时，当你手动修改`display: block`，并且在之后执行一些动画操作。所操作的DOM将会一种比较生硬的方式，出现在动画的最终状态。说明动画并没有执行。
解决方案，在手动修改`display: block`之后，并且在之后执行一些动画操作之前，手动获取一下DOM的位置属性，比如:
```js
const app = document.querySelector('#app')
const height = app.offsetHeight
```
然后就会出现动画了。
方案分析：一系列对DOM的操作都会触发回流或者重绘。
当我读取dom的这些特殊属性时，浏览器就会强制清空渲染队列一次，让我拿到最新的值。也就是说读取的时候，其实已经是display为"block"了。
除了手动读取特殊属性清空浏览器渲染队列外，浏览器也会有自己的一个队列阀值，当达到后，会自动清空。这就是为什么在一个for循环里面多次操作DOM，但是它不会真的渲染那么多次的原因，因为浏览器帮我们维护了一个队列，择机渲染。

# 12. 对比下 Object.defineProperty() 和 proxy() 
Object.defineProperty(obj, prop, descriptor)
- obj 要定义的属性对象
- prop 要定义或修改的属性名称
- descriptor 要定义或修改的属性描述符(分为数据描述符和存取描述符)

数据描述符：
configurable
当且仅当该属性的 configurable 键值为 true 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除。
默认为 false。
enumerable
当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。
默认为 false。
数据描述符还具有以下可选键值：
value
该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。
默认为 undefined。
writable
当且仅当该属性的 writable 键值为 true 时，属性的值，也就是上面的 value，才能被赋值运算符改变。
默认为 false。

存取描述符：
get
属性的 getter 函数，如果没有 getter，则为 undefined。当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 this 对象（由于继承关系，这里的this并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。
默认为 undefined。
set
属性的 setter 函数，如果没有 setter，则为 undefined。当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象。
默认为 undefined。

**如果一个描述符同时拥有 value 或 writable 和 get 或 set 键，则会产生一个异常。**

Proxy 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。
语法：const p = new Proxy(target, handler)

target
要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。
handler
一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。
proxy 除了可以拦截get 和 set 以外，还可以拦截 delete new apply in 等操作。
可以用来定义一个具有数据验证功能的函数，类似于elementui 的表单验证
```js
// 使用proxy 进行验证功能
// let validator = {
//     set: function (obj, prop, value) {
//         if (prop === 'age') {
//             if (!Number.isInteger(value)) {
//                 throw new TypeError('The age is not an integer');
//             }
//             if (value > 200) {
//                 throw new RangeError('The age seems invalid');
//             }
//         }
//         obj[prop] = value;
//         // 表示成功
//         return true;
//     }
// };

// let person = new Proxy({}, validator);

// person.age = 100;

// console.log(person.age);
// // 100

// person.age = 'young';
// // 抛出异常: Uncaught TypeError: The age is not an integer

// person.age = 300;
// // 抛出异常: Uncaught RangeError: The age seems invalid
```