// 如果handler 为空对象，无任何代理的钩子 try try

// const handler = {}

// const target = {}

// const proxy = new Proxy(target, handler)

// proxy.name = 'Hit'
// console.log(proxy)
// console.log(target)

// 由于没有钩子，所有对 proxy 的操作都直接转发给 target。

// 设置有get钩子呢？

// 可以在回调函数中对 target 进行操作。 target 即传进new Proxy 构造函数中的参数、
// 如果不对target 进行操作， 直接返回的将是new Proxy 构造函数的实例对象
// const handler = {
//     get: function (target, props) {
//         return target[props] = 'handler get'
//         // return 'handler get'
//     }
// }

// const target = {
//     name: 'Hit'
// }

// const proxy = new Proxy(target, handler)

// console.log(proxy.name)
// console.log(target.name)

// dictionary = new Proxy(dictionary, ...);

// 覆盖变量，代理应该在所有地方都完全替代了目标对象。目标对象被代理后，任何人都不应该再引用目标对象。否则很容易搞砸。


// 设置 set 钩子， 操作成功后要记得返回true, 不返回要报错。 Uncaught TypeError: 'set' on proxy: trap returned falsish for property '0'

// let numbers = [];

// numbers = new Proxy(numbers, { // (*)
//   set(target, prop, val) { // 拦截写入操作
//     if (typeof val === 'number') {
//       target[prop] = val;
//       return true;
//     } else {
//       return false;
//     }
//   }
// });

// numbers.push(1); // 添加成功
// numbers.push(2); // 添加成功
// alert("Length is: " + numbers.length); // 2

// numbers.push("test"); // TypeError （proxy 的 `set` 操作返回 false）

// alert("This line is never reached (error in the line above)");


// 实现用 in 操作符 来判断范围
// has 钩子 就是用来拦截in 操作符的

// let range = {
//     start: 1,
//     end: 10
//   };

//   range = new Proxy(range, {
//     has(target, prop) {
//       return prop >= target.start && prop <= target.end
//     }
//   });

//   alert(5 in range); // true
//   alert(50 in range); // false

// 创建一个延时执行函数,不使用proxy
// function delay (cb, ms) {
//     return () => {
//         setTimeout(() => cb.apply(cb, arguments), ms);
//     }
// }
// function hello(){
//     alert('hello')
// }

// delay(hello,1000)()

// 创建一个延时执行函数,使用proxy
// apply target 是目标对象（函数是 JavaScript 中的对象）
// thisArg 是 this 的值
// args 是参数列表
// function delay (cb, ms) {
//     return new Proxy(cb, {
//         apply(target, thisArg, args){
//             setTimeout(() => target.apply(thisArg, args), ms);
//         }
//     })
// }
// function hello(){
//     alert('hello')
// }

// delay(hello,1000)()





// var proxy = new Proxy({}, {
//     get: function(obj, prop) {
//         console.log('设置get操作处理')
//         return obj[prop]
//     },
//     set: function(obj, prop, value){
//         console.log('设置set操作处理')
//         obj[prop] = value
//     }
// })
// proxy.time = 35
// console.log(proxy.time)

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

// 封装一个函数， 专门用来过滤掉 falsely 的属性

// const target = {
//     someProp: 1,
//     anyProp: 2,
//     otherProp: '',
//     name: null,
//     age: undefined
// }

// function filterObject(target) {
//     const handler = {
//         get: function (target, key) {
//             return target[key] ?
//                 target[key] :
//                 delete target[key];
//         }
//     }
//     let proxy = new Proxy(target, handler);
//     // 因为proxy 劫持的是get 方法，所以在函数内部手动的循环一遍get对象的操作，
//     // 应该会有更好的方法，待寻找
//     for (let item in proxy) {
//         proxy[item]
//     }
//     return proxy
// }
// console.log(filterObject(target))

// 使用proxy 实现缓存， 在缓存存在的情况下，不从新的api 接口获取新的内容。

// const cache = {
//     'Jone': [34, 56]
// }

// const handler = {
//     set: function (target, props, value) {
//         if (target[props]) {
//             console.log('target[props]', target[props])
//             return target[props]
//         } else {
//             // fetch('some-api-url')
//             //     .then(scoreboard => {
//             //         target[props] = scoreboard
//             //         return scoreboard
//             //     })
//             return target[props] = [100, 100]
//         }
//     }
// }
// const proxy = new Proxy(cache, handler)

// proxy['Jone'] = [100, 100]
// proxy['Hit'] = [10, 10]
// console.log(proxy['Hit'])

// 实现-1来查找数组中的值

// let traget = [1, 2, 3, 4];
// const hander = {
//     get(traget, props) {
//         if (props < 0) {
//             return traget[+props + traget.length]
//         }
//     }
// }

// traget = new Proxy(traget, hander)

// console.log(traget[-3])

// 实现一个observe(监听)，每次目标对象发生改变执行set操作，都能通知到。

// let handlers = Symbol('handlers');

// function makeObservable(target) {
//   // 1. 初始化 handler 存储数组
//   target[handlers] = [];

//   // 存储 handler 函数到数组中以便于未来调用
//   target.observe = function(handler) {
//     this[handlers].push(handler);
//   };

//   // 2. 创建代理以处理更改
//   return new Proxy(target, {
//     set(target, property, value, receiver) {
//       let success = Reflect.set(...arguments); // 转发写入操作到目标对象
//       if (success) { // 如果设置属性的时候没有报错
//         // 调用所有 handler
//         target[handlers].forEach(handler => handler(property, value));
//       }
//       return success;
//     }
//   });
// }

// let user = {};

// user = makeObservable(user);

// user.observe((key, value) => {
//   alert(`SET ${key}=${value}`);
// });

// user.observe((key, value) => {
//     console.log(`SET ${key}=${value}`);
//   });
// user.name = "John";