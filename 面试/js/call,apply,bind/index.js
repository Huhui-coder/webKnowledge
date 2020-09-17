// 第一版call 
// Function.prototype.call2 = function (context) {
//     console.log(context)
//     context.fn = this
//     context.fn()
//     delete context.fn
// }
// var foo = {
//     value: 1
// }
// var bar = function (){
//     console.log(this.value)
// }

// bar.call2(foo)

// call 获取执行的参数

// var foo = {
//     value: 1
// }
// var bar = function (name, age){
//     console.log(this.value, name, age)
// }

// bar.call(foo, 'hit', 23)

// 第二版
// Function.prototype.call2 = function (context) {
//     context.fn = this
//     var args = []
//     for (var i = 1, len = arguments.length; i < len; i++) {
//         args.push('arguments['+i+']')
//     }
//     eval('context.fn('+args+')'); // 自动调用Array.toString()  
//     delete context.fn
// }

// var foo = {
//     value: 1
// };

// function bar(name, age) {
//     console.log(name)
//     console.log(age)
//     console.log(this.value);
// }

// bar.call2(foo, 'kevin', 18); 

// call 函数有返回值

// var obj = {
//     value: 1
// }
// var foo = function (name, age) {
//     return {
//         value: this.value,
//         name,
//         age
//     }
// }
// var result = foo.call(obj, 'hit', 23)
// console.log(result)

// 第三版

// Function.prototype.call2 = function (context) {
//     var context = context || window
//     context.fn = this
//     var args = []
//     for (var i =1, len = arguments.length; i < len; i++) {
//         args.push('arguments[' + i + ']');
//     }
//     var result = eval('context.fn(' + args +')');
//     delete context.fn
//     return result
// }
// // 测试一下
// var value = 2;

// var obj = {
//     value: 1
// }

// function bar(name, age) {
//     console.log(this.value);
//     return {
//         value: this.value,
//         name: name,
//         age: age
//     }
// }

// bar.call2(null); // 2

// console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }


// apply 的实现

// Function.prototype.apply2 = function (context, arr) {
//     var context = context || window
//     context.fn = this
//     var result,
//         args = [];
//     if (arr) {
//         for (var i = 1, len = arguments.length; i < len; i++) {
//             args.push('arguments[' + i + ']');
//         }
//         result = eval('context.fn(' + args + ')');
//     } else {
//         result = context.fn
//     }
//     delete context.fn
//     return result
// }

// var bar = {
//     value: 1
// }
// var foo = function (name, age) {
//     return {
//         value: this.value,
//         name,
//         age
//     }
// }
// var result = foo.apply2(bar, 'hit', 23)
// console.log(result)


// var bar = {
//     value: 1
// }
// var foo = function (name) {
//     console.log(this.value, name)
// }
// var bindFun = foo.bind(bar, 'hit')
// bindFun()

// 第一版 this指向问题，直接使用apply 来解决
// Function.prototype.bind2 = function(context) {
//     var self = this
//     return function () {
//         return self.apply(context)
//     }
// }
// var bar = {
//     value: 1
// }
// var foo = function () {
//     console.log(this.value)
// }
// var bindFun = foo.bind2(bar)
// bindFun()

// var value = 2;

// var foo = {
//     value: 1
// };

// function bar(name, age) {
//     this.habit = 'shopping';
//     console.log(this.value); 
//     console.log(name);
//     console.log(age);
// }

// bar.prototype.friend = 'kevin';

// var bindFoo = bar.bind(foo, 'daisy');

// var obj = new bindFoo('18'); // new 关键字 会改变函数this的指向
// // undefined 
// // daisy
// // 18
// console.log(obj.habit);
// console.log(obj.friend);


// 第三版
// 第四版
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
    console.log(age); // 23
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind2(foo, 'daisy');
// bindFoo(23)
var obj = new bindFoo(23)
console.log(obj.friend) // kevin