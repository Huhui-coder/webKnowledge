// 循环中的var 
var func = []
for (var i = 0; i < 10; i++) {
    func[i] = function () {
        console.log(i)
    }
}

func[8]()

// 闭包，return 一个函数， 所return 的函数 
// 里面引用了外部的变量，
// 并且每次循环引入的外部变量都是一个单独的作用域，
// 所以i 的值每次都是不一样的，并不会被覆盖。
var func = []
for (var i = 0; i < 10; i++) {
    func[i] = (function (i) {
        return function () {
            console.log(i)
        }
    })(i)
}

func[8]()

// 直接使用let
var func = []
for (let i = 0; i < 10; i++) {
    func[i] = function () {
        console.log(i)
    }
}

func[8]()

for (let i = 0; i < 3; i++) {
    let i = 'abc';
    console.log(i);
}
//   abc
//   abc
//   abc

for (var i = 0; i < 3; i++) {
    var i = 'abc';
    console.log(i);
}

//   abc

var funcs = [], object = { a: 1, b: 1, c: 1 };
for (var key in object) {
    funcs.push(function () {
        console.log(key)
    });
}

funcs[0]()
// c


var funcs = [], object = { a: 1, b: 1, c: 1 };
for (let key in object) {
    funcs.push(function () {
        console.log(key)
    });
}

funcs[0]()
// a

var funcs = [], object = { a: 1, b: 1, c: 1 };
for (const key in object) {
    funcs.push(function () {
        console.log(key)
    });
}

funcs[0]()
    // a