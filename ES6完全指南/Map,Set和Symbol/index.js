// Set 类似于数组，但是成员的值都是唯一的，没有重复的值
// const s = new Set();

// [1,2,1,2,4,3,2,2].map(item => s.add(item));

// for (let i of s) {
//     console.log(i)
// }

//往构造函数传参
// const b = new Set([1,2,1,2,4,3,2,2])
// console.log(b.size)

// 数组去重
// const array = [1,2,1,2,4,3,2,2]
// const uniqArray = [...new Set(array)]
// console.log(uniqArray)

// 字符串去重
// const str = '122312312313121222213445'
// const uniqStr = [...new Set(str)].join('')
// console.log(uniqStr)

// 在 Set 内部，两个`NaN`是相等的
// const s = new Set();

// let a = NaN,
//     b = NaN;
// s.add(a);
// s.add(b);
// console.dir(s)  // Set(1)

// 在 Set 内部，两个`Object`总是不相等的
// const e = new Set();

// let a = {},
//     b = {};
// e.add(a);
// e.add(b);
// console.dir(e)  // Set(2)

// 各种实例方法使用
// const u = new Set()

// add
// u.add('ddd')
// console.log(u)
// // delete
// u.delete('ddd')
// console.log(u)
// //has
// u.add('ddd')
// let r = u.has('ddd')
// console.log(r) // true
// u.add('dssdds')
// u.add('dsdsdd33')
// u.clear()
// console.dir(u) // Set(0)

// 使用Array.from 方法可以将Set结构转为数组
// var a = new Set([1,2,3,4,5,6,7,7,6,5])
// var arr = Array.from(a)
// console.log(arr)
// 提供了去除数组重复成员的另一种方法
// function dedupe (array) {
//     return Array.from(new Set(array))
// }
//  var res = dedupe([1,2,1,2,3,2,1,5])
//  console.log(res)

// 遍历操作
// let set = new Set(['red', 'green', 'blue']);

// for (let item of set.keys()) {
//   console.log(item);
// }
// // red
// // green
// // blue

// for (let item of set.values()) {
//   console.log(item);
// }
// // red
// // green
// // blue

// for (let item of set.entries()) {
//   console.log(item);
// }
// // ["red", "red"]
// // ["green", "green"]
// // ["blue", "blue"]

// 遍历的应用，Set的数据结构间接使用数组的map和filter方法
// 实现并集
// var a = [1,2,3,4,5,6],
//     b = [1,35,656,321,7,8];
// var res = [...a].concat([...b])
// console.log(res)
// var a = [1,2,3,4,5,6],
//     b = [1,35,656,321,7,8];
// var res = new Set([...a, ...b])
// console.log(res)
// 实现交集
// var a = new Set([1,2,3,4,5,6]),
//     b = new Set([1,2,35,656,321,7,8]);
//  var res = new Set([...a].filter(x => b.has(x)))
//  console.log(res)
// 实现差集
// var a = new Set([1,2,3,4,5,6]),
//     b = new Set([1,2,35,656,321,7,8]);
//  var res = new Set([...a].filter(x => !b.has(x)))
//  console.log(res)

// map ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
// var a = new Map();
// var o = {name: 'hit'}
// a.set(o ,'hit')
// console.log(a.get(o)) // 'hit'
// console.dir(a) // Map(1) 
// console.log(a.has(o)) // true
// console.log(a.delete(o)) // true
// console.log(a.has(o)) // false

// 使用Map的遍历方法，keys() values() entries()
// const map = new Map([
//     ['F', 'no'],
//     ['T',  'yes'],
//   ]);
  
//   for (let key of map.keys()) {
//     console.log(key);
//   }
//   // "F"
//   // "T"
  
//   for (let value of map.values()) {
//     console.log(value);
//   }
//   // "no"
//   // "yes"
  
//   for (let item of map.entries()) {
//     console.log(item[0], item[1]);
//   }
//   // "F" "no"
//   // "T" "yes"
  
//   // 或者
//   for (let [key, value] of map.entries()) {
//     console.log(key, value);
//   }
//   // "F" "no"
//   // "T" "yes"
  
//   // 等同于使用map.entries()
//   for (let [key, value] of map) {
//     console.log(key, value);
//   }
//   // "F" "no"
//   // "T" "yes"

//  默认情况下Map 结构的默认遍历器接口（Symbol.iterator属性），就是entries方法。
// map[Symbol.iterator] === map.entries
// // true

// 可以通过[...map] 将Map快捷转为数组，从而调用数组的方法、
// const map0 = new Map()
//   .set(1, 'a')
//   .set(2, 'b')
//   .set(3, 'c');

// const map1 = new Map(
//   [...map0].filter(([k, v]) => k < 3)
// );
// // 产生 Map 结构 {1 => 'a', 2 => 'b'}

// const map2 = new Map(
//   [...map0].map(([k, v]) => [k * 2, '_' + v])
//     );
// // 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
