// 使用 generator
var fetch = require('node-fetch');
var co = require('co');

function* gen() {
    var r1 = yield fetch('https://api.github.com/users/github');
    var json1 = yield r1.json();
    console.log(json1.bio);
}

co(gen);

// 使用 async/await
var fetch = require('node-fetch');
var co = require('co');

var fetchData = async function () {
    var r1 = await fetch('https://api.github.com/users/github')
    var json1 = await r1.json()
    console.log(json1.bio)
}
fetchData()

// 实质上， 其实 async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

async function fn(args) {
    // ...
}

// 等同于

function fn(args) {
    return spawn(function* () {
        // ...
    });
}

  // spawn 函数指的是自动执行器，就比如说 co。

  // async 好处在于 将异步的代码换成同步的写法
  // 滥用async 可能会带来的后果，明明两个接口是没有顺序执行的必要的，使用async 造成了顺序执行，浪费了性能。
  // 对于复杂的异步请求流程，Promise.all() 和 Promise.race()提供的api 会更好用。
  // 使用Promise的 all()方法, p的状态由p1、p2、p3决定，分成两种情况。1,三个都成功则返回一个数组，2.有一个失败了，只返回那个失败的。
  // 使用Promise的 race()方法, 那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。
  // 使用Promise的 allSettled()方法, 只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束


