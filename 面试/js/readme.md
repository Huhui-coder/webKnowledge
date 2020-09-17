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


