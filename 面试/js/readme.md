#1、你对`this`有了解吗，有自己实现过`call`,`apply`和`bind`吗？
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

#2. 当使用 new 关键字时发生了什么?


#3. 如何进行数据类型判断?
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

#4.前端的异步编程
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
Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
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



#5.前端的事件循环机制
分浏览器的事件循环和Node.js的事件循环

#6.前端实现动画的方式有哪几种?


