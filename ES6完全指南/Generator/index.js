// function *helloWord (){
//     yield 'hello'   
//     yield 'word'
//     return 'fuxk'
// }

// const hw = helloWord()
// document.body.innerHTML += (hw.next().value)
// document.body.innerHTML += (hw.next().value)
// document.body.innerHTML += (hw.next().value)

// function* f() {
//     console.log('执行了！')
//   }

//   var generator = f();

//   setTimeout(function () {
//     generator.next()
//   }, 2000);

// var myIterable = {};
// myIterable[Symbol.iterator] = function* () {
//     yield 1;
//     yield 2;
//     yield 3;
// };

// console.log([...myIterable])

// function* numbers () {
//     yield 1
//     yield 2
//     return 3
//     yield 4
//   }

//   // 扩展运算符
//   [...numbers()] // [1, 2]

//   // Array.from 方法
//   Array.from(numbers()) // [1, 2]

//   // 解构赋值
//   let [x, y] = numbers();
//   x // 1
//   y // 2

//   // for...of 循环
//   for (let n of numbers()) {
//     console.log(n)
//   }
// 1
// 2
// next方法的参数
function* gen() {
  var x = 0, y = 0 ,z = 0;
  yield x
  yield y
  yield z
  return (x + y + z);
}
var a = gen()

console.log(
  a.next(2)
)
console.log(
  a.next(3)
)
console.log(
  a.next(1)
)
console.log(
  a.next(1)
)

