// 使用ES5 实现数组的 map 方法
// 原生 map 方法的定义 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。
// 两个关键点： 1. 回调函数的参数有哪些，返回值如何处理。2.不修改原来的数组。
// Array.prototype.MyMap = function (fn, context) {
//   console.log(fn) // 传进来的回调函数
//   console.log(this) // .MyMap方法前面的参数，在这里就是调用方法的原数组
//   console.log(context) // 类比原生map 的最后一个参数 指代当前this 对象
//   var arr = Array.prototype.slice.call(this);//由于是ES5所以就不用...展开符了
//   var mappedArr = [];
//   for (var i = 0; i < arr.length; i++) {
//     mappedArr.push(fn.call(context, arr[i], i, arr, context));
//   }
//   return mappedArr;
// }
// var value = 2
// var arr = [1, 2, 3]
// var obj = { value: 2 }
// var fn = (item) => item * 2 + value
// var arr2 = arr.MyMap(fn, obj)
// console.log(arr)
// console.log(arr2)

// 用ES5 实现 reduce 方法
// 原生 reduce 的 定义：reduce() 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。
// 参数: arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
// callback 被称为 reducer 函数,有四个参数, 累加器, 当前值, 当前索引(可选), 源数组(可选)
// initialValue 作为第一次调用 callback函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。

// 将每次返回的结果存储在 累加器  accumulator 中， 并在下次迭代可用。
// Array.prototype.MyReduce = function (fn , initValue) {
//   var arr = Array.prototype.slice.call(this)
//   var acc
//   initValue ? acc = initValue : acc = arr[0]
//   for (var i = 0; i < arr.length; i++) {
//     acc = (fn.call(arr, acc, arr[i], i, arr));
//   }
//   return acc
// }

// 错误写法，没有考虑没传 initValue, 数组循环下标的问题。 如果传了 initValue 应该从 0开始 ， 如果 没传 应该从 1 开始
// Array.prototype.MyReduce = function (fn , initValue) {
//   var arr = Array.prototype.slice.call(this)
//   var startIndex 
//   var acc
//   initValue ? acc = initValue : acc = arr[0]
//   startIndex = initValue ? 0 :  1

//   for (var i = startIndex; i < arr.length; i++) {
//     acc = (fn.call(arr, acc, arr[i], i, arr));
//   }
//   return acc
// }

// var arr = [1, 2, 3]
// var fn = (acc, item) => acc + item
// var arr2 = arr.MyReduce(fn)
// console.log(arr)
// console.log(arr2)

// 手写一个 call/apply 
// Function.prototype.MyCall = function(context = window, ...args) {
//   let func = this
//   let fn
//   context[fn] = func
//   // let res = context[fn](...args) // 如果是 apply  let res = context[fn](args)
//   delete context[fn]
//   return res

// }
// var obj = { value: 1}
// var fn = function (name) {
//   console.log(this.value, name)
// }
// fn.MyCall(obj, [1,1,1,2])

// 手写一个 create 
// 定义: Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。 （请打开浏览器控制台以查看运行结果。）
// var Person = {
//   isSleep: false,
//   printStatus: function () {
//     console.log(`this.name ${this.name}, this.isSleep ${this.isSleep}`)
//   }
// }
// var me = Object.create(Person)

// me.name = 'hit'

// me.printStatus()
// console.log(me.__proto__)
// console.log(me.constructor)

// 将构造函数的原型对象赋值给新创建的对象 的 __proto__, 

// function create (proto) {
//   function F() {}
//   F.prototype = proto
//   F.prototype.constructor = F
//   return new F()
// }
// var Person = {
//   isSleep: false,
//   printStatus: function () {
//     console.log(`this.name ${this.name}, this.isSleep ${this.isSleep}`)
//   }
// }
// var me = create(Person)

// me.name = 'hit'

// me.printStatus()
// console.log(me.__proto__)
// console.log(me.constructor)

// 实现 instanceof 
// instanceof 一个一个原型链向上找，能找到就返回true 找不到就返回false

// function Person (name) {
//   this.name = name
// }

// var p = new Person('hit')
// console.log(p.name)
// console.log(p instanceof Person)

// function MyInstanceof (left, right) {
//   if (!left) return false
//   let proto = Object.getPrototypeOf(left)
//   while (true) {
//     if ( proto === null) return false
//     if (proto === right.prototype) return true
//     proto = Object.getPrototypeOf(proto)
//   }
// }
// function Person (name) {
//   this.name = name
// }

// var p = new Person('hit')
// console.log(MyInstanceof(p, Person))

// 实现单例模式
// 使用 闭包 和 proxy 拦截
// proxy 可以对对象的多种操作进行拦截，例如: get、set、has(in 操作符的拦截)、deleteProperty(delete 操作符的拦截)等等。
