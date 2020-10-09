// // 使用es5的语法创建一个迭代器
// function createIterator(items) {
//     var i = 0;
//     return {
//         next: function () {
//             var done = i >= items.length,
//                 value = !done ? items[i++] : undefined;
//             return {
//                 done: done,
//                 value: value
//             }
//         }
//     }
// }
// const obj = {
//     value: 1
// };

// obj[Symbol.iterator] = function () {
//     return createIterator([1, 2, 3]);
// };

// for (value of obj) {
//     console.log(value);
// }

// // 1
// // 2
// // 3

// 创建一个无限运行的遍历器对象的例子
// function Iterator() {
//     var index = 0;
//     return {
//         next: function () {
//             return { value: index++, done: false}
//         }
//     }
// }

// var it = Iterator()
// var re = it.next().value
// console.log(re)
// var re = it.next().value
// console.log(re)
// var re = it.next().value
// console.log(re)
// var re = it.next().value
// console.log(re)
// var re = it.next().value
// console.log(re)
// var re = it.next().value
// console.log(re)
// var re = it.next().value
// console.log(re)

// 使用默认的Iterator 迭代器
// let obj = {
//     data: [ 'hello', 'world' ],
//     [Symbol.iterator]() {
//       const self = this;
//       let index = 0;
//       return {
//         next() {
//           if (index < self.data.length) {
//             return {
//               value: self.data[index++],
//               done: false
//             };
//           } else {
//             return { value: undefined, done: true };
//           }
//         }
//       };
//     }
//   };

//   for(value of obj) {
//       console.log(value)
//   }

// 模拟内建for...of
// function forOf(obj, cb) {
//     let iterable, result;
//     if (typeof obj[Symbol.iterator] !== "function")
//         throw new TypeError(result + " is not iterable");
//     if (typeof cb !== "function") throw new TypeError("cb must be callable");
//     iterable = obj[Symbol.iterator]();
//     result = iterable.next();
//     while (!result.done) {
//         cb(result.value);
//         result = iterable.next();
//     }
// }
// const callBack = (value) => console.log(value)
// let obj = {
//     data: ['hello', 'world'],
//     [Symbol.iterator]() {
//         const self = this;
//         let index = 0;
//         return {
//             next() {
//                 if (index < self.data.length) {
//                     return {
//                         value: self.data[index++],
//                         done: false
//                     };
//                 } else {
//                     return { value: undefined, done: true };
//                 }
//             }
//         };
//     }
// };
// forOf(obj, callBack)


var arr = [1,2,3,4,5,6]
for(let i = 0, len = arr.length; i < len; i++ ){
    console.log(arr[i])
}