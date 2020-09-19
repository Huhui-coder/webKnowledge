const str = 'hit'
const newStr = new String('hit')
const num = 12
const newNum = new Number(12)
const obj = {}
const newObj = new Object({})
const createObj = Object.create(null)
const arr = []
const newArr = new Array([])
const uni = undefined
const nul = null
// 使用 typeof
// 是一个运算符，运算中需要一个操作数，
// 运算的结果就是这个操作数的类型，运算的结果是一个字符串。
// 他有一定的局限性，对于对象类型的值，只能得到一个”object”结果，却不能精确得到此值的精确类型。
console.log(typeof str) // string
console.log(typeof newStr) // object
console.log(typeof num) // number
console.log(typeof newNum) // object
console.log(typeof obj) // object
console.log(typeof arr) // object
console.log(typeof newArr) // object
console.log(typeof uni) // undefined
console.log(typeof nul) // object



// 使用 instance of 
// 也是一个运算符，运算中需要两个操作数，
// 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

console.log(str instanceof  String) // false
console.log(str instanceof  Object) // false
console.log(newStr instanceof  String) // true
console.log(newStr instanceof  Object) // true
  
console.log(num instanceof  Number) // false
console.log(num instanceof  Object) // false
console.log(newNum instanceof  Number) // true
console.log(newNum instanceof  Object) // true

console.log(obj instanceof  Object) // true
console.log(newObj instanceof  Object) // true
console.log(createObj instanceof  Object) // false

console.log(arr instanceof  Array) // true
console.log(arr instanceof  Object) // true
console.log(newArr instanceof  Array) // true
console.log(newArr instanceof  Object) // true

console.log(uni instanceof  Object) // false
console.log(nul instanceof  Object) // false

// 使用constructor
// constructor是对象的一个属性，不是运算符，constructor属性指向对象的构造函数。
function User () {}
const u = new User()
console.log(u.constructor === User) // true

// 使用 toString()
let a = {}
let b = [1, 2, 3]
let c = '123'
let d = function(){ console.log('fn') }

console.log(a.toString())   // '[object Object]'
console.log(b.toString())   // '1,2,3'
console.log(c.toString())   // '123'
console.log(d.toString())   // 'function(){ console.log('fn') }'


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