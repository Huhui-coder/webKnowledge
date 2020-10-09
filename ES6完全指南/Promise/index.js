//Promise对象代表一个异步操作，
// 有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。


//缺点：Promise也有一些缺点。首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

// const promise = new Promise((resolve, reject) => {
//     const value = 'fulfilled'
//     if (value === 'fulfilled') {
//         resolve(value)
//     } else {
//         reject(value)
//     }
// })
// promise.then(function (value) {
//     console.log(value)
// }, function (error) {
//     console.log(error)
// })

// const timeout = (ms) => {
//     return new Promise((resolve, reject) => {
//         console.log('Promise')
//         setTimeout(resolve, ms, 'done')
//     })
// }

// timeout(3000).then((value) => console.log(value), (error) => console.log(error))
// console.log('hi')

// 上面的代码会依次输出 
// Promise
// hi
// done
// 表明 Promise是已创建就会立即执行，
// Promise实例的.then()回调函数是Promise的状态变为resolved之后才会执行

// 使用Promise来包装一个Ajax方法
// const getJSON = function (url) {
//     const promise = new Promise(function (resolve, reject) {
//         const handler = function () {
//             if (this.readyState !== 4) {
//                 return;
//             }
//             if (this.status === 200) {
//                 resolve(this.response);
//             } else {
//                 reject(new Error(this.statusText));
//             }
//         };
//         const client = new XMLHttpRequest();
//         client.open("GET", url);
//         client.onreadystatechange = handler;
//         client.responseType = "json";
//         client.setRequestHeader("Accept", "application/json");
//         client.send();

//     });

//     return promise;
// };

// getJSON("./post.json").then(function (json) {
//     console.log('Contents: ' + JSON.stringify(json));
// }, function (error) {
//     console.error('出错了', error);
// });

// function loadImageAsync(url) {
//     return new Promise(function(resolve, reject) {
//       const image = new Image();

//       image.onload = function() {
//         resolve(image);
//       };

//       image.onerror = function() {
//         reject(new Error('Could not load image at ' + url));
//       };

//       image.src = url;
//     });
//   }
//   var p = loadImageAsync('./2.jpg')
//   console.log(p.then(value => console.log(value).catch(err => console.log(err))))
// 将一个Promise的实例作为resolve函数的参数，Promise的实例的状态也会传递到下一个Promise实例当中
// const rejectPromise = new Promise((resolve, reject) => {
//     setTimeout(() => reject(new Error('fail')), 3000)
// })

// const promise = new Promise((resolve, reject) => {
//     setTimeout(() => resolve(rejectPromise), 1000)
// })
// promise.then(result => console.log(result))
//     .catch(error => console.log(error))
// 上面的代码，// Error: fail，  promise实例返回的状态由 rejectPromise 返回的状态决定

//调用resolve或reject并不会终结 Promise 的参数函数的执行。
// var promise = new Promise((res,rej) => {
//     res(222)
//     console.log(11)
// })
// promise.then(v => console.log(v))

// promise.then((value) => console.log(value))
//上面代码中，调用resolve(1)以后，后面的console.log(2)还是会执行，
// 并且会首先打印出来。这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，
// 总是晚于本轮循环的同步任务。
// 一般来说，调用resolve或reject以后，Promise 的使命就完成了，后继操作应该放到then方法里面，而不应该直接写在resolve或reject的后面。所以，最好在它们前面加上return语句，这样就不会有意外。
// var pro = new Promise((resolve, reject) => {
//     return reject('err');
//     // 后面的语句不会执行
//     console.log(2);
// })
// pro.then(value => console.log(value))
//     .catch(err => console.log(err))
// .then()的链式调用

// var p1 = new Promise((resolve, reject) => {
//     resolve(1)
// })

// var p2 = new Promise((resolve, reject) => {
//     setTimeout(() => resolve(2), 3000)
//     })
// p1.then(function (v) {
//     return p2;
// }).then(function (v) {
//     console.log(++v)
// });
// 对于要处理错误的情况
// 一般来说，不要在then()方法里面定义 Reject 状态的回调函数（即then的第二个参数），总是使用catch方法。

// Promise.then(data => {
//     console.log(data)
// })
//     .catch(err => {
//         new Error(err)
//     })

// const someAsyncThing = function() {
//     return new Promise(function(resolve, reject) {
//       // 下面一行会报错，因为x没有声明
//       resolve(x + 2);
//     });
//   };

//   someAsyncThing()
//   .catch(function(error) {
//     console.log('oh no', error);
//   })
//   .then(function() {
//     console.log('carry on');
//   })
//   .finally(function () {
//       console.log('finally')
//   })

// const promise = new Promise(function(resolve, reject) {
//     throw new Error('test');
//   });
//   promise.catch(function(error) {
//     console.log(error);
//   });

// 使用Promise的 all()方法, p的状态由p1、p2、p3决定，分成两种情况。1,三个都成功则返回一个数组，2.有一个失败了，只返回那个失败的。
// var a = new Promise((res,rej) => {
//     setTimeout(rej, 3000, '3000done')
// })

// var b = new Promise((res,rej) => {
//     setTimeout(rej, 2000, '2000done')
// })

// var c = new Promise((res,rej) => {
//     setTimeout(rej, 1000, '1000done')
// })

// var p = Promise.all([a,b,c])
// p.then(value => console.log(value)).catch(err => console.log(err))

// 使用Promise的 race()方法, 那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。
// var a = new Promise((res,rej) => {
//     setTimeout(res, 3000, '3000done')
// })

// var b = new Promise((res,rej) => {
//     setTimeout(res, 2000, '2000done')
// })

// var c = new Promise((res,rej) => {
//     setTimeout(res, 1000, '1000done')
// })

// var p = Promise.race([a,b,c])
// p.then(value => console.log(value))

// 使用Promise的 allSettled()方法, 只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束
// var a = new Promise((res,rej) => {
//     setTimeout(res, 3000, '3000done')
// })

// var b = new Promise((res,rej) => {
//     setTimeout(rej, 2000, '2000done')
// })

// var c = new Promise((res,rej) => {
//     setTimeout(res, 1000, '1000done')
// })

// var p = Promise.allSettled([a,b,c])
// p.then(value => console.log(value))
// 何时使用 allSettled() 有时候，我们不关心异步操作的结果，只关心这些操作有没有结束。这时，Promise.allSettled()方法就很有用。如果没有这个方法，想要确保所有操作都结束，就很麻烦。Promise.all()方法无法做到这一点。

// 使用Promise.resolve. 将现有对象转为 Promise 对象
// Promise.resolve('foo')
// // 等价于
// new Promise(resolve => resolve('foo'))
// 使用Promise.resolve()方法时，不同的参数，有不同的处理方式

// Promise.resolve()的参数是 Promise实例 直接返回
// Promise.resolve()的参数是 thenable。thenable对象指的是具有then方法的对象，比如下面这个对象。
// Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。
// var thenable = {
//     then: function(resovle, reject) {
//         resovle(42)
//     }
// }

// let p1 = Promise.resolve(thenable)
// p1.then(value => console.log(value))
// Promise.resolve()的参数不是具有then方法的对象，或根本就不是对象
// 如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。
// var p = Promise.resolve('hello')
// p.then(value => console.log(value))

// 不带有任何参数，直接返回一个resolved状态的 Promise 对象。
// var p = Promise.resolve()
// // 注意执行的顺序
// setTimeout(()=> console.log('three'), 1000)

// p.then(_ => console.log('two'))

// console.log('one')
// 需要注意的是，立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。
// 上面代码中，setTimeout(fn, 0)在下一轮“事件循环”开始时执行，Promise.resolve()在本轮“事件循环”结束时执行，console.log('one')则是立即执行，因此最先输出。

// Promise.reject()

// const thenable = {
//     then(resolve, reject) {
//         resolve('没错了')
//         reject('出错了')
//     }
//   };

//   Promise.resolve(thenable)
//   .catch(e => {
//     console.log(e === thenable)
//   })
//   .then(value => {
//       console.log(value)
//   })

// 应用，当图片加载完成后，将图片放到canvas里面渲染
// 如果直接使用file协议 使用 canvas.toDataURL('image/jpg') 会报错 index.js:238 Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
//         使用 http 或者 https 协议打开文件，并且添加 img.crossOrigin = 'Anonymous' 就不会报错了。
// previewImg = function (path) {
//     return new Promise((resolve, reject) => {
//         const canvas = document.createElement('canvas') // 创建canvas DOM元素
//         const ctx = canvas.getContext('2d')
//         const img = new Image()
//         img.onload = function () {
//             canvas.height = img.height // 指定画板的高度,自定义
//             canvas.width = img.width // 指定画板的宽度，自定义
//             document.getElementById('canvas').appendChild(canvas)
//             ctx.drawImage(img, 0, 0) // 参数可自定义
//             resolve(canvas.toDataURL('image/jpg'))
//         }
//         img.onerror = reject
//         img.crossOrigin = 'Anonymous'
//         img.src = path
//     })
// }
// var p = previewImg('./1.jpg')
// console.log(p.then(value => console.log(value)))

// 红绿灯问题
// 题目：红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯（用 Promse 实现）
// 解法： promise + 递归
// 这是亮灯的函数
function red() {
    console.log('red');
}
function green() {
    console.log('green');
}
function yellow() {
    console.log('yellow');
}

// 这是执行亮灯的函数 两个参数，timer: 亮灯的时间， cb: 后面亮灯的种类
var light = function (timer, cb) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            cb()
            resolve()
        }, timer);
    })
}
var step = function () {
    // 1为 N + 1
    Promise.resolve().then(function () {
        return light(3000, red)
    }).then(function () {
        return light(1000, green)
    }).then(function () {
        return light(2000, yellow)
    }).then(function () {
        step()
    })
}
step()